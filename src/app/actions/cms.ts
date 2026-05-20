"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase";
import { pageTypePaths, type PageWritingType } from "@/lib/cms-schema";
import type { AssemblyRow, NewsRow, WritingRow } from "@/lib/cms-schema";

// ─────────────────────────────────────────────────────────────
// NEWS / ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────

export async function addNewsAction(payload: {
  title: string;
  content_text: string;
  image_url: string | null;
  published_at: string | null;
}): Promise<NewsRow> {
  const db = createAdminClient();
  const { data, error } = await db.from("news").insert(payload).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/announcements");
  revalidatePath("/");
  return data as NewsRow;
}

export async function updateNewsAction(
  id: number,
  patch: Partial<Pick<NewsRow, "title" | "content_text" | "image_url" | "published_at">>,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("news").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/announcements");
  revalidatePath("/");
}

export async function deleteNewsAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("news").delete().eq("id", id);
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
    Pick<AssemblyRow, "date_iso" | "speaker" | "topic" | "youtube_url" | "wav_url">
  >,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("assembly").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sermons-topics");
  revalidatePath("/");
}

export async function deleteSermonAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("assembly").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sermons-topics");
  revalidatePath("/");
}

// ─────────────────────────────────────────────────────────────
// WRITINGS — articles
// ─────────────────────────────────────────────────────────────

export async function addArticleAction(payload: {
  title: string;
  content_text: string;
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
  patch: Partial<Pick<WritingRow, "title" | "content_text" | "date_iso" | "author">>,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/articles");
}

export async function deleteArticleAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/articles");
}

// ─────────────────────────────────────────────────────────────
// WRITINGS — missionary reports
// ─────────────────────────────────────────────────────────────

export async function addMissionaryAction(payload: {
  title: string;
  content_text: string;
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
  patch: Partial<Pick<WritingRow, "title" | "content_text" | "date_iso" | "author">>,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/missions");
}

export async function deleteMissionaryAction(id: number): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("writings").delete().eq("id", id);
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
