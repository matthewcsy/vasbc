/**
 * Server-side Supabase query functions.
 * Import these only in Server Components or Server Actions.
 */
import { supabase } from "./supabase";
import type { AssemblyRow, NewsRow, WritingRow } from "./cms-schema";
import { pageWritingTypes } from "./cms-schema";

/** All news rows, newest first */
export async function getNews(): Promise<NewsRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("id", { ascending: false });
  if (error) {
    console.error("[getNews]", error.message);
    return [];
  }
  return (data ?? []) as NewsRow[];
}

/** All assembly/sermon rows, newest date first */
export async function getAssembly(): Promise<AssemblyRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("assembly")
    .select("*")
    .order("date_iso", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("[getAssembly]", error.message);
    return [];
  }
  return (data ?? []) as AssemblyRow[];
}

/** Writings filtered by type, newest date first */
export async function getWritingsByType(type: string): Promise<WritingRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .eq("type", type)
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

/** News rows paginated, newest first. Returns data + total count. */
export async function getNewsPaginated(
  page: number,
  pageSize: number,
): Promise<{ data: NewsRow[]; total: number }> {
  if (!supabase) return { data: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await supabase
    .from("news")
    .select("*", { count: "exact" })
    .order("id", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("[getNewsPaginated]", error.message);
    return { data: [], total: 0 };
  }
  return { data: (data ?? []) as NewsRow[], total: count ?? 0 };
}

/** Assembly/sermon rows paginated, newest date first. */
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
    .order("date_iso", { ascending: false, nullsFirst: false })
    .range(from, to);
  if (error) {
    console.error("[getAssemblyPaginated]", error.message);
    return { data: [], total: 0 };
  }
  return { data: (data ?? []) as AssemblyRow[], total: count ?? 0 };
}

/** Writings by type paginated, newest date first. */
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

