export const adminSectionKeys = [
  "announcements",
  "sermons",
  "articles",
  "missionary",
  "standard-pages",
] as const;

export type AdminSectionKey = (typeof adminSectionKeys)[number];
