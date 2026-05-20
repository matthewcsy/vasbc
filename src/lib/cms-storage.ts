/**
 * Server-side Supabase query functions.
 * Import these only in Server Components or Server Actions.
 */
import { supabase } from "./supabase";
import type { AssemblyRow, NewsRow, PhotoGalleryItemRow, PhotoGalleryRow, PhotoRow, WritingRow } from "./cms-schema";
import { pageWritingTypes } from "./cms-schema";

/** All news rows, newest first, excluding soft-deleted */
export async function getNews(): Promise<NewsRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("is_deleted", false)
    .order("id", { ascending: false });
  if (error) {
    console.error("[getNews]", error.message);
    return [];
  }
  return (data ?? []) as NewsRow[];
}

/** News rows filtered by category */
export async function getNewsByCategory(category: string): Promise<NewsRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("is_deleted", false)
    .eq("category", category)
    .order("id", { ascending: false });
  if (error) {
    console.error("[getNewsByCategory]", error.message);
    return [];
  }
  return (data ?? []) as NewsRow[];
}

/** Single news row by ID */
export async function getNewsById(id: number): Promise<NewsRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .maybeSingle();
  if (error) {
    console.error("[getNewsById]", error.message);
    return null;
  }
  return data as NewsRow | null;
}

/** All assembly/sermon rows, newest date first, excluding soft-deleted */
export async function getAssembly(): Promise<AssemblyRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("assembly")
    .select("*")
    .eq("is_deleted", false)
    .order("date_iso", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("[getAssembly]", error.message);
    return [];
  }
  return (data ?? []) as AssemblyRow[];
}

/** Single assembly row by ID */
export async function getAssemblyById(id: number): Promise<AssemblyRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("assembly")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .maybeSingle();
  if (error) {
    console.error("[getAssemblyById]", error.message);
    return null;
  }
  return data as AssemblyRow | null;
}

/** Writings filtered by type, newest date first, excluding soft-deleted */
export async function getWritingsByType(type: string): Promise<WritingRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .eq("type", type)
    .eq("is_deleted", false)
    .order("date_iso", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("[getWritingsByType]", error.message);
    return [];
  }
  return (data ?? []) as WritingRow[];
}

/** Single CMS simple-page row by type key */
export async function getPageContent(type: string): Promise<WritingRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .eq("type", type)
    .maybeSingle();
  if (error) {
    console.error("[getPageContent]", error.message);
    return null;
  }
  return data as WritingRow | null;
}

/** All CMS simple-page rows at once (for admin panel) */
export async function getAllPageContents(): Promise<WritingRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .in("type", [...pageWritingTypes]);
  if (error) {
    console.error("[getAllPageContents]", error.message);
    return [];
  }
  return (data ?? []) as WritingRow[];
}

/** News rows paginated, newest first, excluding soft-deleted. */
export async function getNewsPaginated(
  page: number,
  pageSize: number,
  category?: string,
): Promise<{ data: NewsRow[]; total: number }> {
  if (!supabase) return { data: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from("news")
    .select("*", { count: "exact" })
    .eq("is_deleted", false)
    .order("id", { ascending: false })
    .range(from, to);
  if (category) query = query.eq("category", category);
  const { data, count, error } = await query;
  if (error) {
    console.error("[getNewsPaginated]", error.message);
    return { data: [], total: 0 };
  }
  return { data: (data ?? []) as NewsRow[], total: count ?? 0 };
}

/** Assembly/sermon rows paginated, newest date first, excluding soft-deleted. */
export async function getAssemblyPaginated(
  page: number,
  pageSize: number,
): Promise<{ data: AssemblyRow[]; total: number }> {
  if (!supabase) return { data: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await supabase
    .from("assembly")
    .select("*", { count: "exact" })
    .eq("is_deleted", false)
    .order("date_iso", { ascending: false, nullsFirst: false })
    .range(from, to);
  if (error) {
    console.error("[getAssemblyPaginated]", error.message);
    return { data: [], total: 0 };
  }
  return { data: (data ?? []) as AssemblyRow[], total: count ?? 0 };
}

/** Writings by type paginated, newest date first, excluding soft-deleted. */
export async function getWritingsByTypePaginated(
  type: string,
  page: number,
  pageSize: number,
): Promise<{ data: WritingRow[]; total: number }> {
  if (!supabase) return { data: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await supabase
    .from("writings")
    .select("*", { count: "exact" })
    .eq("type", type)
    .eq("is_deleted", false)
    .order("date_iso", { ascending: false, nullsFirst: false })
    .range(from, to);
  if (error) {
    console.error("[getWritingsByTypePaginated]", error.message);
    return { data: [], total: 0 };
  }
  return { data: (data ?? []) as WritingRow[], total: count ?? 0 };
}

/** Single writing row by ID. */
export async function getWritingById(id: number): Promise<WritingRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[getWritingById]", error.message);
    return null;
  }
  return data as WritingRow | null;
}

// ─────────────────────────────────────────────────────────────
// PHOTOS
// ─────────────────────────────────────────────────────────────

/** All non-deleted photos, newest first */
export async function getPhotos(): Promise<PhotoRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getPhotos]", error.message);
    return [];
  }
  return (data ?? []) as PhotoRow[];
}

/** Hero carousel photos ordered by hero_order */
export async function getHeroCarouselPhotos(): Promise<PhotoRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("in_hero_carousel", true)
    .eq("is_deleted", false)
    .order("hero_order", { ascending: true });
  if (error) {
    console.error("[getHeroCarouselPhotos]", error.message);
    return [];
  }
  return (data ?? []) as PhotoRow[];
}

/** All non-deleted galleries */
export async function getPhotoGalleries(): Promise<PhotoGalleryRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("photo_galleries")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getPhotoGalleries]", error.message);
    return [];
  }
  return (data ?? []) as PhotoGalleryRow[];
}

/** Photos belonging to a gallery (with full photo data), ordered by sort_order */
export async function getGalleryPhotos(
  galleryId: number,
): Promise<(PhotoGalleryItemRow & { photo: PhotoRow })[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("photo_gallery_items")
    .select("*, photo:photos(*)")
    .eq("gallery_id", galleryId)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[getGalleryPhotos]", error.message);
    return [];
  }
  return (data ?? []) as (PhotoGalleryItemRow & { photo: PhotoRow })[];
}

/** Soft-deleted items across all tables (for /admin/recover) */
export async function getDeletedItems(): Promise<{
  news: NewsRow[];
  assembly: AssemblyRow[];
  writings: WritingRow[];
  photos: PhotoRow[];
  galleries: PhotoGalleryRow[];
}> {
  if (!supabase) {
    return { news: [], assembly: [], writings: [], photos: [], galleries: [] };
  }
  const [n, a, w, p, g] = await Promise.all([
    supabase.from("news").select("*").eq("is_deleted", true),
    supabase.from("assembly").select("*").eq("is_deleted", true),
    supabase.from("writings").select("*").eq("is_deleted", true),
    supabase.from("photos").select("*").eq("is_deleted", true),
    supabase.from("photo_galleries").select("*").eq("is_deleted", true),
  ]);
  return {
    news: (n.data ?? []) as NewsRow[],
    assembly: (a.data ?? []) as AssemblyRow[],
    writings: (w.data ?? []) as WritingRow[],
    photos: (p.data ?? []) as PhotoRow[],
    galleries: (g.data ?? []) as PhotoGalleryRow[],
  };
}

