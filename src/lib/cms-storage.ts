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

