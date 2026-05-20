"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AssemblyRow, NewsRow, WritingRow } from "@/lib/cms-schema";
import { pageWritingTypes, type PageWritingType } from "@/lib/cms-schema";
import {
  addArticleAction,
  addMissionaryAction,
  addNewsAction,
  addSermonAction,
  deleteArticleAction,
  deleteMissionaryAction,
  deleteNewsAction,
  deleteSermonAction,
  updatePageContentAction,
  uploadAnnouncementImageAction,
  uploadSermonAudioAction,
} from "@/app/actions/cms";
import { adminSectionKeys, type AdminSectionKey } from "@/components/admin/admin-sections";

const sectionMeta: Record<AdminSectionKey, { label: string; title: string }> = {
  announcements: { label: "最新消息", title: "最新消息管理" },
  sermons: { label: "講道／專題", title: "講道／專題管理" },
  articles: { label: "文章分享", title: "文章分享管理" },
  missionary: { label: "宣教工場", title: "宣教工場管理" },
  "standard-pages": { label: "標準頁面", title: "標準頁面管理" },
  photos: { label: "相片庫", title: "相片庫管理" },
  "photo-gallery": { label: "相簿管理", title: "相簿管理" },
  recover: { label: "回收站", title: "回收站" },
};

const pageTypeLabels: Record<PageWritingType, string> = {
  "gathering-times": "聚會時間",
  "about-beliefs": "教會信仰",
  "about-history": "教會簡史",
  "about-covenant": "教會約章",
  "about-deacons": "執事名錄",
  "about-staff": "同工名錄",
  recruitment: "招聘",
  "contact-us": "聯絡我們",
};

type Props = {
  activeSection: AdminSectionKey;
  initialNews: NewsRow[];
  initialSermons: AssemblyRow[];
  initialArticles: WritingRow[];
  initialMissionary: WritingRow[];
  initialStandardPages: WritingRow[];
};

export function AdminDashboard({
  activeSection,
  initialNews,
  initialSermons,
  initialArticles,
  initialMissionary,
  initialStandardPages,
}: Props) {
  const [news, setNews] = useState<NewsRow[]>(initialNews);
  const [sermons, setSermons] = useState<AssemblyRow[]>(initialSermons);
  const [articles, setArticles] = useState<WritingRow[]>(initialArticles);
  const [missionary, setMissionary] = useState<WritingRow[]>(initialMissionary);
  const [standardPages, setStandardPages] = useState<WritingRow[]>(initialStandardPages);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const [annForm, setAnnForm] = useState({
    title: "", published_at: "", content_text: "", image_url: "", category: "church",
  });
  const annImageRef = useRef<HTMLInputElement>(null);

  const [sermonForm, setSermonForm] = useState({
    date_iso: "", speaker: "", topic: "", youtube_url: "", wav_url: "", content_text: "",
  });
  const [sermonDragOver, setSermonDragOver] = useState(false);

  const [articleForm, setArticleForm] = useState({
    title: "", date_iso: "", author: "", content_text: "",
  });

  const [missionaryForm, setMissionaryForm] = useState({
    title: "", date_iso: "", author: "", content_text: "",
  });

  const [pageSaving, setPageSaving] = useState<Record<string, boolean>>({});
  const [pagePatches, setPagePatches] = useState<Record<string, Partial<WritingRow>>>({});

  async function run<T>(fn: () => Promise<T>): Promise<T | null> {
    setBusy(true); setError(null);
    try { return await fn(); }
    catch (e) { setError((e as Error).message); return null; }
    finally { setBusy(false); }
  }

  function flash(msg: string) {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2500);
  }

  async function handleAddNews() {
    if (!annForm.title || !annForm.content_text) return;
    const row = await run(() => addNewsAction({
      title: annForm.title, content_text: annForm.content_text,
      image_url: annForm.image_url || null, published_at: annForm.published_at || null,
      category: annForm.category,
    }));
    if (row) {
      setNews((prev) => [row, ...prev]);
      setAnnForm({ title: "", published_at: "", content_text: "", image_url: "", category: "church" });
      if (annImageRef.current) annImageRef.current.value = "";
      flash("已新增消息");
    }
  }

  async function handleUploadAnnImage(file: File) {
    const fd = new FormData(); fd.append("file", file);
    const url = await run(() => uploadAnnouncementImageAction(fd));
    if (url) setAnnForm((p) => ({ ...p, image_url: url }));
  }

  async function handleDeleteNews(id: number) {
    if (!confirm("確定要刪除（移至回收站）？")) return;
    await run(() => deleteNewsAction(id));
    setNews((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleAddSermon() {
    if (!sermonForm.speaker || !sermonForm.topic) return;
    const row = await run(() => addSermonAction({
      date_iso: sermonForm.date_iso || null, speaker: sermonForm.speaker,
      topic: sermonForm.topic, youtube_url: sermonForm.youtube_url || null,
      wav_url: sermonForm.wav_url || null, content_text: sermonForm.content_text || null,
    }));
    if (row) {
      setSermons((prev) => [row, ...prev]);
      setSermonForm({ date_iso: "", speaker: "", topic: "", youtube_url: "", wav_url: "", content_text: "" });
      flash("已新增講道");
    }
  }

  async function handleSermonAudioDrop(e: React.DragEvent) {
    e.preventDefault(); setSermonDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "mp3" && ext !== "wav") { setError("僅支援 MP3 或 WAV 格式"); return; }
    const fd = new FormData(); fd.append("file", file);
    const url = await run(() => uploadSermonAudioAction(fd));
    if (url) setSermonForm((p) => ({ ...p, wav_url: url }));
  }

  async function handleDeleteSermon(id: number) {
    if (!confirm("確定要刪除（移至回收站）？")) return;
    await run(() => deleteSermonAction(id));
    setSermons((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleAddArticle() {
    if (!articleForm.title || !articleForm.content_text) return;
    const row = await run(() => addArticleAction({
      title: articleForm.title, content_text: articleForm.content_text,
      date_iso: articleForm.date_iso || null, author: articleForm.author || null,
    }));
    if (row) {
      setArticles((prev) => [row, ...prev]);
      setArticleForm({ title: "", date_iso: "", author: "", content_text: "" });
      flash("已發佈文章");
    }
  }

  async function handleDeleteArticle(id: number) {
    if (!confirm("確定要刪除（移至回收站）？")) return;
    await run(() => deleteArticleAction(id));
    setArticles((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleAddMissionary() {
    if (!missionaryForm.title || !missionaryForm.content_text) return;
    const row = await run(() => addMissionaryAction({
      title: missionaryForm.title, content_text: missionaryForm.content_text,
      date_iso: missionaryForm.date_iso || null, author: missionaryForm.author || null,
    }));
    if (row) {
      setMissionary((prev) => [row, ...prev]);
      setMissionaryForm({ title: "", date_iso: "", author: "", content_text: "" });
      flash("已發佈報導");
    }
  }

  async function handleDeleteMissionary(id: number) {
    if (!confirm("確定要刪除（移至回收站）？")) return;
    await run(() => deleteMissionaryAction(id));
    setMissionary((prev) => prev.filter((item) => item.id !== id));
  }

  function setPagePatch(type: string, patch: Partial<WritingRow>) {
    setPagePatches((prev) => ({ ...prev, [type]: { ...prev[type], ...patch } }));
  }

  async function handleSavePage(type: PageWritingType) {
    const patch = pagePatches[type];
    if (!patch || Object.keys(patch).length === 0) return;
    setPageSaving((prev) => ({ ...prev, [type]: true }));
    try {
      await updatePageContentAction(type, patch);
      setStandardPages((prev) =>
        prev.map((item) => (item.type === type ? { ...item, ...patch } : item)),
      );
      setPagePatches((prev) => ({ ...prev, [type]: {} }));
      flash(`已儲存「${pageTypeLabels[type]}」`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPageSaving((prev) => ({ ...prev, [type]: false }));
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-500">Admin CMS</h2>
        <div className="grid gap-1">
          {adminSectionKeys.map((key) => (
            <Button
              key={key} size="sm"
              variant={activeSection === key ? "secondary" : "ghost"}
              className="justify-start" asChild
            >
              <Link href={`/admin/${key}`}>{sectionMeta[key].label}</Link>
            </Button>
          ))}
        </div>
      </aside>

      <main className="space-y-6">
        <div>
          <Badge>受保護後台</Badge>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{sectionMeta[activeSection].title}</h1>
        </div>
        {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
        {saved && <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{saved}</p>}

        {/* ANNOUNCEMENTS */}
        {activeSection === "announcements" && (
          <>
            <Card>
              <CardTitle>新增最新消息</CardTitle>
              <CardDescription>欄位：標題、日期、分類、內容、圖片</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="ann-title">標題 *</Label>
                  <Input id="ann-title" value={annForm.title} onChange={(e) => setAnnForm((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="ann-date">日期</Label>
                  <Input id="ann-date" type="date" value={annForm.published_at} onChange={(e) => setAnnForm((p) => ({ ...p, published_at: e.target.value }))} />
                </div>
                <div>
                  <Label>分類</Label>
                  <div className="mt-1 flex gap-5">
                    {[{ value: "church", label: "勝利道潮語浸信會" }, { value: "mangrove", label: "木川共享空間" }].map(({ value, label }) => (
                      <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input type="radio" name="ann-category" value={value} checked={annForm.category === value} onChange={() => setAnnForm((p) => ({ ...p, category: value }))} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="ann-desc">內容 *</Label>
                  <Textarea id="ann-desc" rows={3} value={annForm.content_text} onChange={(e) => setAnnForm((p) => ({ ...p, content_text: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="ann-image-url">圖片 URL</Label>
                  <Input id="ann-image-url" placeholder="https://..." value={annForm.image_url} onChange={(e) => setAnnForm((p) => ({ ...p, image_url: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="ann-image-file">上傳圖片至 Storage</Label>
                  <Input id="ann-image-file" ref={annImageRef} type="file" accept="image/*"
                    onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleUploadAnnImage(file); }} />
                </div>
                <Button onClick={handleAddNews} disabled={busy} className="w-fit">新增消息</Button>
              </div>
            </Card>
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-medium text-slate-700">消息列表（共 {news.length} 則）</p>
              </div>
              <div className="divide-y divide-slate-100">
                {news.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.published_at ?? "無日期"} · {item.category === "mangrove" ? "木川" : "教會"}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" asChild><Link href={`/admin/announcements/${item.id}`}>編輯</Link></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" disabled={busy} onClick={() => void handleDeleteNews(item.id)}>刪除</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SERMONS */}
        {activeSection === "sermons" && (
          <>
            <Card>
              <CardTitle>新增講道／專題</CardTitle>
              <CardDescription>YouTube 連結、直接音頻 URL 或拖放 MP3/WAV 上傳</CardDescription>
              <div className="mt-4 grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="sermon-speaker">講員 *</Label>
                    <Input id="sermon-speaker" value={sermonForm.speaker} onChange={(e) => setSermonForm((p) => ({ ...p, speaker: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="sermon-date">日期</Label>
                    <Input id="sermon-date" type="date" value={sermonForm.date_iso} onChange={(e) => setSermonForm((p) => ({ ...p, date_iso: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sermon-topic">講題 *</Label>
                  <Input id="sermon-topic" value={sermonForm.topic} onChange={(e) => setSermonForm((p) => ({ ...p, topic: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="sermon-youtube">YouTube URL</Label>
                  <Input id="sermon-youtube" placeholder="https://www.youtube.com/watch?v=..." value={sermonForm.youtube_url} onChange={(e) => setSermonForm((p) => ({ ...p, youtube_url: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="sermon-wav">音頻 URL（WAV / MP3）</Label>
                  <Input id="sermon-wav" placeholder="https://..." value={sermonForm.wav_url} onChange={(e) => setSermonForm((p) => ({ ...p, wav_url: e.target.value }))} />
                </div>
                <div>
                  <Label>或拖放 MP3 / WAV 上傳</Label>
                  <div
                    className={`mt-1 flex min-h-[72px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed text-sm transition-colors ${sermonDragOver ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-300 bg-slate-50 text-slate-400"}`}
                    onDragOver={(e) => { e.preventDefault(); setSermonDragOver(true); }}
                    onDragLeave={() => setSermonDragOver(false)}
                    onDrop={(e) => void handleSermonAudioDrop(e)}
                    onClick={() => document.getElementById("sermon-audio-file")?.click()}
                  >
                    {busy ? "上傳中…" : sermonForm.wav_url ? "✓ 音頻已上傳" : "拖放 MP3 或 WAV 至此（或點擊選擇）"}
                  </div>
                  <input id="sermon-audio-file" type="file" accept="audio/mp3,audio/mpeg,audio/wav" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fakeDrop = { preventDefault: () => {}, dataTransfer: { files: [file] } } as unknown as React.DragEvent;
                      void handleSermonAudioDrop(fakeDrop);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-text">備注 / 文字內容（可選）</Label>
                  <Textarea id="sermon-text" rows={3} placeholder="可輸入講道摘要、經文或備注…" value={sermonForm.content_text} onChange={(e) => setSermonForm((p) => ({ ...p, content_text: e.target.value }))} />
                </div>
                <Button onClick={handleAddSermon} disabled={busy} className="w-fit">新增講道</Button>
              </div>
            </Card>
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-medium text-slate-700">講道列表（共 {sermons.length} 則）</p>
              </div>
              <div className="divide-y divide-slate-100">
                {sermons.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{item.topic ?? "（無標題）"}</p>
                      <p className="text-xs text-slate-400">{item.speaker ?? "—"} · {item.date_iso ?? item.date ?? "無日期"}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" asChild><Link href={`/admin/sermons/${item.id}`}>編輯</Link></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" disabled={busy} onClick={() => void handleDeleteSermon(item.id)}>刪除</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ARTICLES */}
        {activeSection === "articles" && (
          <>
            <Card>
              <CardTitle>新增文章</CardTitle>
              <CardDescription>欄位：標題、日期、作者、內容摘要（完整編輯於獨立頁面）</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="article-title">標題 *</Label>
                  <Input id="article-title" value={articleForm.title} onChange={(e) => setArticleForm((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="article-date">日期</Label>
                    <Input id="article-date" type="date" value={articleForm.date_iso} onChange={(e) => setArticleForm((p) => ({ ...p, date_iso: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="article-author">作者</Label>
                    <Input id="article-author" value={articleForm.author} onChange={(e) => setArticleForm((p) => ({ ...p, author: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="article-content">內容摘要 *</Label>
                  <Textarea id="article-content" rows={4} value={articleForm.content_text} onChange={(e) => setArticleForm((p) => ({ ...p, content_text: e.target.value }))} />
                </div>
                <Button onClick={handleAddArticle} disabled={busy} className="w-fit">發佈文章</Button>
              </div>
            </Card>
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-medium text-slate-700">文章列表（共 {articles.length} 篇）</p>
              </div>
              <div className="divide-y divide-slate-100">
                {articles.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.date_iso ?? item.date ?? "無日期"}{item.author && ` · ${item.author}`}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" asChild><Link href={`/admin/articles/${item.id}`}>編輯</Link></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" disabled={busy} onClick={() => void handleDeleteArticle(item.id)}>刪除</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MISSIONARY */}
        {activeSection === "missionary" && (
          <>
            <Card>
              <CardTitle>新增宣教報導</CardTitle>
              <CardDescription>欄位：標題、日期、作者、內容摘要（完整編輯於獨立頁面）</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="miss-title">標題 *</Label>
                  <Input id="miss-title" value={missionaryForm.title} onChange={(e) => setMissionaryForm((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="miss-date">日期</Label>
                    <Input id="miss-date" type="date" value={missionaryForm.date_iso} onChange={(e) => setMissionaryForm((p) => ({ ...p, date_iso: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="miss-author">作者／宣教士</Label>
                    <Input id="miss-author" value={missionaryForm.author} onChange={(e) => setMissionaryForm((p) => ({ ...p, author: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="miss-content">內容摘要 *</Label>
                  <Textarea id="miss-content" rows={4} value={missionaryForm.content_text} onChange={(e) => setMissionaryForm((p) => ({ ...p, content_text: e.target.value }))} />
                </div>
                <Button onClick={handleAddMissionary} disabled={busy} className="w-fit">發佈報導</Button>
              </div>
            </Card>
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-medium text-slate-700">報導列表（共 {missionary.length} 篇）</p>
              </div>
              <div className="divide-y divide-slate-100">
                {missionary.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.date_iso ?? item.date ?? "無日期"}{item.author && ` · ${item.author}`}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" asChild><Link href={`/admin/missionary/${item.id}`}>編輯</Link></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" disabled={busy} onClick={() => void handleDeleteMissionary(item.id)}>刪除</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* STANDARD PAGES */}
        {activeSection === "standard-pages" && (
          <div className="grid gap-4">
            {pageWritingTypes.map((type) => {
              const item = standardPages.find((p) => p.type === type);
              const isSaving = pageSaving[type] ?? false;
              return (
                <Card key={type} className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{pageTypeLabels[type]}</CardTitle>
                      <CardDescription>路徑：/{type.replace("about-", "about/")}</CardDescription>
                    </div>
                    <Button size="sm" disabled={isSaving} onClick={() => void handleSavePage(type)}>
                      {isSaving ? "儲存中…" : "儲存"}
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>標題</Label>
                      <Input defaultValue={item?.title ?? ""} onChange={(e) => setPagePatch(type, { title: e.target.value })} />
                    </div>
                    <div>
                      <Label>按鈕文字</Label>
                      <Input defaultValue={item?.button_label ?? ""} onChange={(e) => setPagePatch(type, { button_label: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>按鈕連結</Label>
                    <Input defaultValue={item?.button_href ?? ""} onChange={(e) => setPagePatch(type, { button_href: e.target.value })} />
                  </div>
                  <div>
                    <Label>內容</Label>
                    <Textarea rows={5} defaultValue={item?.content_text ?? ""} onChange={(e) => setPagePatch(type, { content_text: e.target.value })} />
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeSection === "photos" && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            相片庫獨立頁面：<Link href="/admin/photos" className="text-blue-600 underline">/admin/photos</Link>
          </div>
        )}
        {activeSection === "photo-gallery" && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            相簿管理獨立頁面：<Link href="/admin/photo-gallery" className="text-blue-600 underline">/admin/photo-gallery</Link>
          </div>
        )}
        {activeSection === "recover" && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            回收站獨立頁面：<Link href="/admin/recover" className="text-blue-600 underline">/admin/recover</Link>
          </div>
        )}
      </main>
    </div>
  );
}
