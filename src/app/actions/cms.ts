"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase";
import { pageTypePaths, type PageWritingType } from "@/lib/cms-schema";
import type { AssemblyRow, NewsRow, PhotoGalleryRow, PhotoRow, WritingRow } from "@/lib/cms-schema";

// ─────────────────────────────────────────────────────────────
// NEWS / ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────

export async function addNewsAction(payload: {
  title: string;
  content_text: string;
  image_url: string | null;
  published_at: string | null;
  category: string;
}): Promise<NewsRow> {
  const db = createAdminClient();
  const { data, error } = await db.from("news").insert(payload).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/announcements");
  revalidatePath("/mangrove-space");
  revalidatePath("/");
  return data as NewsRow;
}

export async function updateNewsAction(
  id: number,
  patch: Partial<Pick<NewsRow, "title" | "content_text" | "image_url" | "published_at" | "category">>,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("news").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/announcements");
  revalidatePath("/mangrove-space");
  revalidatePath("/");
}

/** Soft-delete a news row (sets is_deleted = true) */
export async function deleteNewsAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("news").update({ is_deleted: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/announcements");
  revalidatePath("/mangrove-space");
  revalidatePath("/");
}

/** Restore a soft-deleted news row */
export async function restoreNewsAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("news").update({ is_deleted: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/announcements");
  revalidatePath("/");
}

/**
 * Upload an image to Supabase Storage (bucket: "announcements") and return
 * the public URL. Requires the bucket to be created as PUBLIC in the dashboard.
 */
export async function uploadAnnouncementImageAction(
  formData: FormData,
): Promise<string | null> {
  const file = formData.get("file") as File | null;
  if (!file) return null;

  const db = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await db.storage.from("announcements").upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error("[uploadAnnouncementImage]", error.message);
    return null;
  }

  const { data } = db.storage.from("announcements").getPublicUrl(filename);
  return data.publicUrl;
}

// ─────────────────────────────────────────────────────────────
// ASSEMBLY / SERMONS
// ─────────────────────────────────────────────────────────────

export async function addSermonAction(payload: {
  date_iso: string | null;
  speaker: string;
  topic: string;
  youtube_url: string | null;
  wav_url: string | null;
  content_text?: string | null;
  content_html?: string | null;
}): Promise<AssemblyRow> {
  const db = createAdminClient();
  const { data, error } = await db.from("assembly").insert(payload).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/sermons-topics");
  revalidatePath("/");
  return data as AssemblyRow;
}

export async function updateSermonAction(
  id: number,
  patch: Partial<
    Pick<AssemblyRow, "date_iso" | "speaker" | "topic" | "youtube_url" | "wav_url" | "content_text" | "content_html">
  >,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("assembly").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sermons-topics");
  revalidatePath("/");
}

/** Soft-delete a sermon row */
export async function deleteSermonAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("assembly").update({ is_deleted: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sermons-topics");
  revalidatePath("/");
}

/** Restore a soft-deleted sermon row */
export async function restoreSermonAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("assembly").update({ is_deleted: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sermons-topics");
  revalidatePath("/");
}

/**
 * Upload a sermon audio file (mp3/wav) to Supabase Storage (bucket: "sermons")
 * and return the public URL.
 */
export async function uploadSermonAudioAction(formData: FormData): Promise<string | null> {
  const file = formData.get("file") as File | null;
  if (!file) return null;

  const db = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp3";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await db.storage.from("sermons").upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error("[uploadSermonAudio]", error.message);
    return null;
  }

  const { data } = db.storage.from("sermons").getPublicUrl(filename);
  return data.publicUrl;
}

// ─────────────────────────────────────────────────────────────
// WRITINGS — articles
// ─────────────────────────────────────────────────────────────

export async function addArticleAction(payload: {
  title: string;
  content_text: string;
  content_html?: string | null;
  date_iso: string | null;
  author: string | null;
}): Promise<WritingRow> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("writings")
    .insert({ ...payload, type: "article" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/articles");
  return data as WritingRow;
}

export async function updateArticleAction(
  id: number,
  patch: Partial<Pick<WritingRow, "title" | "content_text" | "content_html" | "date_iso" | "author" | "image_url">>,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/articles");
}

/** Soft-delete an article row */
export async function deleteArticleAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update({ is_deleted: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/articles");
}

/** Restore a soft-deleted article */
export async function restoreArticleAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update({ is_deleted: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/articles");
}

// ─────────────────────────────────────────────────────────────
// WRITINGS — missionary reports
// ─────────────────────────────────────────────────────────────

export async function addMissionaryAction(payload: {
  title: string;
  content_text: string;
  content_html?: string | null;
  date_iso: string | null;
  author: string | null;
}): Promise<WritingRow> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("writings")
    .insert({ ...payload, type: "missionary" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/missions");
  return data as WritingRow;
}

export async function updateMissionaryAction(
  id: number,
  patch: Partial<Pick<WritingRow, "title" | "content_text" | "content_html" | "date_iso" | "author" | "image_url">>,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/missions");
}

/** Soft-delete a missionary row */
export async function deleteMissionaryAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update({ is_deleted: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/missions");
}

/** Restore a soft-deleted missionary row */
export async function restoreMissionaryAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update({ is_deleted: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/missions");
}

// ─────────────────────────────────────────────────────────────
// WRITINGS — simple pages (gathering-times, about/*, etc.)
// ─────────────────────────────────────────────────────────────

export async function updatePageContentAction(
  type: PageWritingType,
  patch: Partial<
    Pick<
      WritingRow,
      "title" | "content_text" | "content_html" | "image_url" | "button_label" | "button_href"
    >
  >,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update(patch).eq("type", type);
  if (error) throw new Error(error.message);
  const path = pageTypePaths[type];
  if (path) revalidatePath(path);
}

// ─────────────────────────────────────────────────────────────
// PHOTOS
// ─────────────────────────────────────────────────────────────

/**
 * Upload a photo to Supabase Storage (bucket: "photos") and insert a row.
 * Returns the new PhotoRow or null on error.
 */
export async function uploadPhotoAction(formData: FormData): Promise<PhotoRow | null> {
  const file = formData.get("file") as File | null;
  if (!file) return null;

  const db = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await db.storage.from("photos").upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (upErr) {
    console.error("[uploadPhoto]", upErr.message);
    return null;
  }

  const { data: urlData } = db.storage.from("photos").getPublicUrl(filename);
  const url = urlData.publicUrl;

  // Determine widescreen by image dimensions passed from client if available
  const widthStr = formData.get("width") as string | null;
  const heightStr = formData.get("height") as string | null;
  const width = widthStr ? parseInt(widthStr, 10) : null;
  const height = heightStr ? parseInt(heightStr, 10) : null;
  const is_widescreen = width && height ? width / height >= 16 / 9 - 0.05 : false;

  const { data, error: dbErr } = await db
    .from("photos")
    .insert({ filename, url, width, height, is_widescreen })
    .select()
    .single();

  if (dbErr) {
    console.error("[uploadPhoto DB]", dbErr.message);
    return null;
  }

  revalidatePath("/admin/photos");
  revalidatePath("/");
  return data as PhotoRow;
}

/** Soft-delete a photo */
export async function deletePhotoAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("photos").update({ is_deleted: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/photos");
  revalidatePath("/");
}

/** Restore a soft-deleted photo */
export async function restorePhotoAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("photos").update({ is_deleted: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/photos");
}

/** Toggle a photo's hero carousel membership */
export async function togglePhotoCarouselAction(
  id: number,
  inCarousel: boolean,
): Promise<void> {
  const db = createAdminClient();
  const patch = inCarousel
    ? { in_hero_carousel: true }
    : { in_hero_carousel: false, hero_order: null };
  const { error } = await db.from("photos").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/photos");
}

/** Save the hero carousel order (array of photo IDs in sequence) */
export async function saveCarouselOrderAction(ids: number[]): Promise<void> {
  const db = createAdminClient();
  await db.from("photos").update({ in_hero_carousel: false, hero_order: null })
    .eq("in_hero_carousel", true);
  for (let i = 0; i < ids.length; i++) {
    await db.from("photos").update({ in_hero_carousel: true, hero_order: i + 1 }).eq("id", ids[i]);
  }
  revalidatePath("/");
  revalidatePath("/admin/photos");
}

// ─────────────────────────────────────────────────────────────
// PHOTO GALLERIES
// ─────────────────────────────────────────────────────────────

export async function addPhotoGalleryAction(title: string): Promise<PhotoGalleryRow> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("photo_galleries")
    .insert({ title })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as PhotoGalleryRow;
}

export async function updatePhotoGalleryAction(id: number, title: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("photo_galleries").update({ title }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deletePhotoGalleryAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("photo_galleries").update({ is_deleted: true }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restorePhotoGalleryAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("photo_galleries").update({ is_deleted: false }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addPhotoToGalleryAction(
  galleryId: number,
  photoId: number,
  sortOrder: number,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("photo_gallery_items")
    .upsert({ gallery_id: galleryId, photo_id: photoId, sort_order: sortOrder });
  if (error) throw new Error(error.message);
}

export async function removePhotoFromGalleryAction(
  galleryId: number,
  photoId: number,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("photo_gallery_items")
    .delete()
    .eq("gallery_id", galleryId)
    .eq("photo_id", photoId);
  if (error) throw new Error(error.message);
}

export async function saveGalleryOrderAction(
  galleryId: number,
  photoIds: number[],
): Promise<void> {
  const db = createAdminClient();
  for (let i = 0; i < photoIds.length; i++) {
    await db
      .from("photo_gallery_items")
      .update({ sort_order: i })
      .eq("gallery_id", galleryId)
      .eq("photo_id", photoIds[i]);
  }
}

// ─────────────────────────────────────────────────────────────
// RECOVER (restore soft-deleted items)
// ─────────────────────────────────────────────────────────────

export async function restoreWritingAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update({ is_deleted: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/articles");
  revalidatePath("/missions");
}

