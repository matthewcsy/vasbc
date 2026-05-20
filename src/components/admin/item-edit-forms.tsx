"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import type { AssemblyRow, NewsRow, WritingRow } from "@/lib/cms-schema";
import {
  updateNewsAction,
  updateSermonAction,
  updateArticleAction,
  updateMissionaryAction,
} from "@/app/actions/cms";

// ─── Announcement edit ────────────────────────────────────────
export function AnnouncementEditForm({ item }: { item: NewsRow }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: item.title,
    published_at: item.published_at ?? "",
    content_text: item.content_text ?? "",
    image_url: item.image_url ?? "",
    category: item.category ?? "church",
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setBusy(true); setError(null);
    try {
      await updateNewsAction(item.id, {
        title: form.title,
        published_at: form.published_at || null,
        content_text: form.content_text,
        image_url: form.image_url || null,
        category: form.category,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">已儲存</p>}
      <div>
        <Label>標題</Label>
        <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <div>
        <Label>日期</Label>
        <Input type="date" value={form.published_at} onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value }))} />
      </div>
      <div>
        <Label>分類</Label>
        <div className="mt-1 flex gap-5">
          {[{ value: "church", label: "勝利道潮語浸信會" }, { value: "mangrove", label: "木川共享空間" }].map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" name="ann-category" value={value} checked={form.category === value} onChange={() => setForm((p) => ({ ...p, category: value }))} />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label>圖片 URL</Label>
        <Input value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} />
      </div>
      <div>
        <Label>內容</Label>
        <Textarea rows={6} value={form.content_text} onChange={(e) => setForm((p) => ({ ...p, content_text: e.target.value }))} />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={busy}>{busy ? "儲存中…" : "儲存"}</Button>
        <Button variant="ghost" onClick={() => router.back()}>返回</Button>
      </div>
    </Card>
  );
}

// ─── Sermon edit ──────────────────────────────────────────────
export function SermonEditForm({ item }: { item: AssemblyRow }) {
  const router = useRouter();
  const [form, setForm] = useState({
    speaker: item.speaker ?? "",
    date_iso: item.date_iso ?? "",
    topic: item.topic ?? "",
    youtube_url: item.youtube_url ?? "",
    wav_url: item.wav_url ?? "",
    content_text: item.content_text ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setBusy(true); setError(null);
    try {
      await updateSermonAction(item.id, {
        speaker: form.speaker,
        date_iso: form.date_iso || null,
        topic: form.topic,
        youtube_url: form.youtube_url || null,
        wav_url: form.wav_url || null,
        content_text: form.content_text || null,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">已儲存</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>講員</Label>
          <Input value={form.speaker} onChange={(e) => setForm((p) => ({ ...p, speaker: e.target.value }))} />
        </div>
        <div>
          <Label>日期</Label>
          <Input type="date" value={form.date_iso} onChange={(e) => setForm((p) => ({ ...p, date_iso: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label>講題</Label>
        <Input value={form.topic} onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))} />
      </div>
      <div>
        <Label>YouTube URL</Label>
        <Input value={form.youtube_url} onChange={(e) => setForm((p) => ({ ...p, youtube_url: e.target.value }))} />
      </div>
      <div>
        <Label>音頻 URL（WAV / MP3）</Label>
        <Input value={form.wav_url} onChange={(e) => setForm((p) => ({ ...p, wav_url: e.target.value }))} />
      </div>
      <div>
        <Label>備注 / 文字內容</Label>
        <Textarea rows={5} value={form.content_text} onChange={(e) => setForm((p) => ({ ...p, content_text: e.target.value }))} />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={busy}>{busy ? "儲存中…" : "儲存"}</Button>
        <Button variant="ghost" onClick={() => router.back()}>返回</Button>
      </div>
    </Card>
  );
}

// ─── Article edit ─────────────────────────────────────────────
export function ArticleEditForm({ item }: { item: WritingRow }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: item.title,
    date_iso: item.date_iso ?? "",
    author: item.author ?? "",
    image_url: item.image_url ?? "",
    content_text: item.content_text ?? "",
    content_html: item.content_html ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setBusy(true); setError(null);
    try {
      await updateArticleAction(item.id, {
        title: form.title,
        date_iso: form.date_iso || null,
        author: form.author || null,
        image_url: form.image_url || null,
        content_text: form.content_text || null,
        content_html: form.content_html || null,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">已儲存</p>}
      <div>
        <Label>標題</Label>
        <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>日期</Label>
          <Input type="date" value={form.date_iso} onChange={(e) => setForm((p) => ({ ...p, date_iso: e.target.value }))} />
        </div>
        <div>
          <Label>作者</Label>
          <Input value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label>圖片 URL</Label>
        <Input value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} />
      </div>
      <div>
        <Label>文章內容（富文本）</Label>
        <TiptapEditor content={form.content_html} onChange={(html) => setForm((p) => ({ ...p, content_html: html }))} />
      </div>
      <div>
        <Label>純文字摘要（用於卡片預覽）</Label>
        <Textarea rows={3} value={form.content_text} onChange={(e) => setForm((p) => ({ ...p, content_text: e.target.value }))} />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={busy}>{busy ? "儲存中…" : "儲存"}</Button>
        <Button variant="ghost" onClick={() => router.back()}>返回</Button>
      </div>
    </Card>
  );
}

// ─── Missionary edit ──────────────────────────────────────────
export function MissionaryEditForm({ item }: { item: WritingRow }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: item.title,
    date_iso: item.date_iso ?? "",
    author: item.author ?? "",
    image_url: item.image_url ?? "",
    content_text: item.content_text ?? "",
    content_html: item.content_html ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setBusy(true); setError(null);
    try {
      await updateMissionaryAction(item.id, {
        title: form.title,
        date_iso: form.date_iso || null,
        author: form.author || null,
        image_url: form.image_url || null,
        content_text: form.content_text || null,
        content_html: form.content_html || null,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">已儲存</p>}
      <div>
        <Label>標題</Label>
        <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>日期</Label>
          <Input type="date" value={form.date_iso} onChange={(e) => setForm((p) => ({ ...p, date_iso: e.target.value }))} />
        </div>
        <div>
          <Label>作者／宣教士</Label>
          <Input value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label>圖片 URL</Label>
        <Input value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} />
      </div>
      <div>
        <Label>報導內容（富文本）</Label>
        <TiptapEditor content={form.content_html} onChange={(html) => setForm((p) => ({ ...p, content_html: html }))} />
      </div>
      <div>
        <Label>純文字摘要（用於卡片預覽）</Label>
        <Textarea rows={3} value={form.content_text} onChange={(e) => setForm((p) => ({ ...p, content_text: e.target.value }))} />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={busy}>{busy ? "儲存中…" : "儲存"}</Button>
        <Button variant="ghost" onClick={() => router.back()}>返回</Button>
      </div>
    </Card>
  );
}
