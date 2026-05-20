#!/usr/bin/env python3
"""Migrate vasbc.db SQLite data into Supabase.

Usage:
    pip install supabase
    SUPABASE_URL=https://... SUPABASE_SECRET_KEY=... python supabase/migrate_sqlite_to_supabase.py

Or pass them as CLI args:
    python supabase/migrate_sqlite_to_supabase.py --url https://... --key sbr_...

The script is safe to re-run: it uses upsert with on_conflict='id'.
Make sure you have run supabase/schema.sql in the Supabase SQL editor first.
"""

import argparse
import os
import re
import sqlite3
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Parse args / env
# ---------------------------------------------------------------------------
parser = argparse.ArgumentParser(description="Migrate vasbc.db → Supabase")
parser.add_argument("--url", default=os.environ.get("SUPABASE_URL", ""))
parser.add_argument("--key", default=os.environ.get("SUPABASE_SECRET_KEY", ""))
parser.add_argument(
    "--db",
    default=str(Path(__file__).parent.parent / "vasbc.db"),
    help="Path to vasbc.db (default: project root)",
)
parser.add_argument(
    "--flush",
    action="store_true",
    help="Delete all existing rows in news, assembly, writings before migrating",
)
args = parser.parse_args()

if not args.url or not args.key:
    print(
        "ERROR: Supabase URL and service-role key are required.\n"
        "Set SUPABASE_URL and SUPABASE_SECRET_KEY env vars, or use --url / --key.",
        file=sys.stderr,
    )
    sys.exit(1)

try:
    from supabase import create_client
except ImportError:
    print("ERROR: supabase-py not installed. Run: pip install supabase", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Connect to SQLite and Supabase
# ---------------------------------------------------------------------------
db_path = Path(args.db)
if not db_path.exists():
    print(f"ERROR: SQLite file not found: {db_path}", file=sys.stderr)
    sys.exit(1)

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

sb = create_client(args.url, args.key)

# ---------------------------------------------------------------------------
# Optional flush
# ---------------------------------------------------------------------------
if args.flush:
    print("Flushing existing data...")
    for tbl in ("news", "assembly", "writings"):
        sb.table(tbl).delete().gte("id", 0).execute()
        print(f"  {tbl}: cleared")

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
BATCH = 100  # rows per upsert batch

_ISO_DATE_RE = re.compile(r"^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$")


def sanitize_date(value: str | None) -> str | None:
    """Return value if it's a valid YYYY-MM-DD date, otherwise None."""
    if not value:
        return None
    return value if _ISO_DATE_RE.match(str(value)) else None


def upsert_batches(table: str, rows: list[dict], on_conflict: str = "id") -> None:
    total = len(rows)
    if total == 0:
        print(f"  {table}: no rows to migrate")
        return
    for i in range(0, total, BATCH):
        chunk = rows[i : i + BATCH]
        sb.table(table).upsert(chunk, on_conflict=on_conflict).execute()
    print(f"  {table}: migrated {total} rows")


# ---------------------------------------------------------------------------
# news
# ---------------------------------------------------------------------------
print("Migrating news...")
cur.execute("SELECT * FROM news")
cols = [d[0] for d in cur.description]
news_rows = []
for row in cur.fetchall():
    r = dict(zip(cols, row))
    # Remove columns that don't exist in Supabase schema
    r.pop("content_html", None)  # keep only content_text
    # Ensure nullable columns are None (not empty string) where appropriate
    for col in ("image_url", "scraped_at"):
        if col in r and r[col] == "":
            r[col] = None
    r["published_at"] = sanitize_date(r.get("published_at"))
    news_rows.append(r)
upsert_batches("news", news_rows)

# ---------------------------------------------------------------------------
# assembly  (sermons)
# ---------------------------------------------------------------------------
print("Migrating assembly...")
cur.execute("SELECT * FROM assembly")
cols = [d[0] for d in cur.description]
assembly_rows = []
for row in cur.fetchall():
    r = dict(zip(cols, row))
    # audio_mp3_path may contain local Windows paths; keep as-is but note it won't play
    for col in ("wav_filename", "wav_url", "audio_mp3_path", "youtube_url", "scraped_at"):
        if col in r and r[col] == "":
            r[col] = None
    r["date_iso"] = sanitize_date(r.get("date_iso"))
    assembly_rows.append(r)
upsert_batches("assembly", assembly_rows)

# ---------------------------------------------------------------------------
# writings  (articles + standard pages)
# ---------------------------------------------------------------------------
print("Migrating writings...")
cur.execute("SELECT * FROM writings")
cols = [d[0] for d in cur.description]
writing_rows = []
for row in cur.fetchall():
    r = dict(zip(cols, row))
    r.pop("content_html", None)  # keep content_text
    for col in ("author", "image_url", "button_label", "button_href", "scraped_at"):
        if col in r and r[col] == "":
            r[col] = None
    r["date_iso"] = sanitize_date(r.get("date_iso"))
    writing_rows.append(r)
upsert_batches("writings", writing_rows)

# ---------------------------------------------------------------------------
# Seed standard pages (if not already present)
# ---------------------------------------------------------------------------
PAGE_TYPES = [
    "gathering-times",
    "about-beliefs",
    "about-history",
    "about-covenant",
    "about-deacons",
    "about-staff",
    "missions",
    "recruitment",
    "contact-us",
]

PAGE_TITLES = {
    "gathering-times": "聚會時間",
    "about-beliefs": "信仰宣言",
    "about-history": "教會歷史",
    "about-covenant": "教會盟約",
    "about-deacons": "執事會",
    "about-staff": "同工團隊",
    "missions": "宣教事工",
    "recruitment": "同工招募",
    "contact-us": "聯絡我們",
}

print("Seeding standard page rows (if missing)...")
existing_types = (
    sb.table("writings")
    .select("type")
    .in_("type", PAGE_TYPES)
    .execute()
    .data
)
existing_set = {r["type"] for r in existing_types}
seed_rows = [
    {"type": t, "title": PAGE_TITLES[t], "content_text": ""}
    for t in PAGE_TYPES
    if t not in existing_set
]
if seed_rows:
    # Use IDs above the current max so we don't collide with migrated rows
    max_id_res = sb.table("writings").select("id").order("id", desc=True).limit(1).execute()
    max_id = max_id_res.data[0]["id"] if max_id_res.data else 0
    for i, row in enumerate(seed_rows, start=max_id + 1):
        row["id"] = i
    sb.table("writings").insert(seed_rows).execute()
    print(f"  Seeded {len(seed_rows)} standard page rows")
else:
    print("  All standard pages already exist")

conn.close()
print("Done!")
