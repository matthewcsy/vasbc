export const adminSectionKeys = [
  "announcements",
  "sermons",
  "articles",
  "missionary",
  "standard-pages",
  "photos",
  "photo-gallery",
  "recover",
] as const;

export type AdminSectionKey = (typeof adminSectionKeys)[number];
