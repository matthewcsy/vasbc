-- ============================================================
-- VASBC Supabase Schema
-- ============================================================
-- How to run:
--   Supabase Dashboard → SQL Editor → paste this file → Run
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────

-- news: church announcements / news articles
--   (scraped from vasbc.org; also managed via admin panel)
CREATE TABLE IF NOT EXISTS news (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT        NOT NULL,
  content_html TEXT,
  content_text TEXT,                   -- short description shown on cards
  image_url    TEXT,
  published_at DATE,
  scraped_at   TIMESTAMPTZ DEFAULT NOW()
);

-- assembly: sermon / worship service records
CREATE TABLE IF NOT EXISTS assembly (
  id             BIGSERIAL PRIMARY KEY,
  date           TEXT,                 -- raw Chinese date string e.g. "2025年9月14日"
  date_iso       DATE,                 -- normalised YYYY-MM-DD
  speaker        TEXT,
  topic          TEXT,
  wav_filename   TEXT,
  wav_url        TEXT,                 -- direct WAV streaming URL from vasbc.org
  audio_mp3_path TEXT,                 -- local path on scraper machine (informational only)
  youtube_url    TEXT,                 -- manually-added YouTube link
  scraped_at     TIMESTAMPTZ DEFAULT NOW()
);

-- writings: articles, missionary reports, and CMS-managed simple pages
--
-- type values
--   scraped content : 'article'          (from share.asp)
--                     'missionary'       (from preac.asp)
--   simple pages    : 'gathering-times'
--                     'about-beliefs'
--                     'about-history'
--                     'about-covenant'
--                     'about-deacons'
--                     'about-staff'
--                     'missions'
--                     'recruitment'
--                     'contact-us'
CREATE TABLE IF NOT EXISTS writings (
  id           BIGSERIAL PRIMARY KEY,
  type         TEXT        NOT NULL,
  date         TEXT,
  date_iso     DATE,
  author       TEXT,
  title        TEXT        NOT NULL DEFAULT '',
  content_html TEXT,
  content_text TEXT,
  image_url    TEXT,                   -- page hero image (simple pages)
  button_label TEXT,                   -- CTA button label (simple pages)
  button_href  TEXT,                   -- CTA button link  (simple pages)
  scraped_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_writings_type ON writings (type);


-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Public visitors can read everything.
-- The service role key used by Server Actions bypasses RLS.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE news     ENABLE ROW LEVEL SECURITY;
ALTER TABLE assembly ENABLE ROW LEVEL SECURITY;
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_news"
  ON news FOR SELECT USING (true);

CREATE POLICY "public_read_assembly"
  ON assembly FOR SELECT USING (true);

CREATE POLICY "public_read_writings"
  ON writings FOR SELECT USING (true);


-- ─────────────────────────────────────────────────────────────
-- SUPABASE STORAGE BUCKET (for announcement images)
-- Do this in the Dashboard UI, NOT here:
--   Dashboard → Storage → New bucket
--   Bucket name : announcements
--   Public      : YES (tick the checkbox)
-- ─────────────────────────────────────────────────────────────


-- ─────────────────────────────────────────────────────────────
-- DEFAULT SEED: simple-page rows in writings
-- These give each page a starting title/description that the
-- admin can later edit.  Run AFTER the migration script so
-- the auto-increment id does not collide.
-- ─────────────────────────────────────────────────────────────

INSERT INTO writings (type, title, content_text, button_label, button_href)
VALUES
  ('gathering-times', '聚會時間',
   '主日崇拜、祈禱會與各團契聚會時間將於此頁更新。',
   '參與聚會', '/contact-us'),

  ('about-beliefs',  '教會信仰',
   '說明教會核心信仰與聖經立場。',
   '聯絡我們', '/contact-us'),

  ('about-history',  '教會簡史',
   '記錄教會建立、發展與社區同行的重要里程。',
   '查看更多消息', '/announcements'),

  ('about-covenant', '教會約章',
   '展示教會約章內容，幫助會眾理解共同承諾。',
   '教會信仰', '/about/beliefs'),

  ('about-deacons',  '執事名錄',
   '展示現任執事與其服事範疇。',
   '同工名錄', '/about/staff'),

  ('about-staff',    '同工名錄',
   '展示教會與木川共享空間同工團隊。',
   '聯絡我們', '/contact-us'),

  ('missions',       '宣教工場',
   '展示本地與海外宣教工場近況、代禱事項與參與方式。',
   '文章分享', '/articles'),

  ('recruitment',    '招聘',
   '刊登教會及木川共享空間相關職位招聘資訊。',
   '提交查詢', '/contact-us'),

  ('contact-us',     '聯絡我們',
   '提供地址、電話、電郵與地圖，歡迎隨時聯絡我們。',
   '返回主頁', '/')

ON CONFLICT DO NOTHING;
