// ─────────────────────────────────────────────────────────────
// Database row types — match Supabase column names exactly
// ─────────────────────────────────────────────────────────────

export type NewsRow = {
  id: number;
  title: string;
  content_html: string | null;
  content_text: string | null; // short description shown on cards
  image_url: string | null;
  published_at: string | null;
  scraped_at: string;
};

export type AssemblyRow = {
  id: number;
  date: string | null;     // raw Chinese date string
  date_iso: string | null; // normalised YYYY-MM-DD
  speaker: string | null;
  topic: string | null;
  wav_filename: string | null;
  wav_url: string | null;        // direct WAV streaming URL
  audio_mp3_path: string | null; // local path on scraper machine
  youtube_url: string | null;    // manually added YouTube link
  scraped_at: string;
};

export type WritingRow = {
  id: number;
  type: string;
  date: string | null;
  date_iso: string | null;
  author: string | null;
  title: string;
  content_html: string | null;
  content_text: string | null;
  image_url: string | null;    // hero image for simple pages
  button_label: string | null; // CTA button label for simple pages
  button_href: string | null;  // CTA button link for simple pages
  scraped_at: string;
};

// ─────────────────────────────────────────────────────────────
// Page type keys (used as `type` column value in writings)
// ─────────────────────────────────────────────────────────────

export const pageWritingTypes = [
  "gathering-times",
  "about-beliefs",
  "about-history",
  "about-covenant",
  "about-deacons",
  "about-staff",
  "missions",
  "recruitment",
  "contact-us",
] as const;

export type PageWritingType = (typeof pageWritingTypes)[number];

/** Maps each page type to its URL path — used for cache revalidation */
export const pageTypePaths: Record<PageWritingType, string> = {
  "gathering-times": "/gathering-times",
  "about-beliefs": "/about/beliefs",
  "about-history": "/about/history",
  "about-covenant": "/about/covenant",
  "about-deacons": "/about/deacons",
  "about-staff": "/about/staff",
  missions: "/missions",
  recruitment: "/recruitment",
  "contact-us": "/contact-us",
};



