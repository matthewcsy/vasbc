export const adminSectionKeys = [
  "announcements",
  "sermons",
  "articles",
  "standard-pages",
] as const;

export type AdminSectionKey = (typeof adminSectionKeys)[number];
