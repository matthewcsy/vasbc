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
  addNewsAction,
  addSermonAction,
  deleteArticleAction,
  deleteNewsAction,
  deleteSermonAction,
  updateArticleAction,
  updateNewsAction,
  updatePageContentAction,
  updateSermonAction,
  uploadAnnouncementImageAction,
} from "@/app/actions/cms";
import { adminSectionKeys, type AdminSectionKey } from "@/components/admin/admin-sections";

const sectionMeta: Record<AdminSectionKey, { label: string; title: string }> = {
  announcements: { label: "最新消息", title: "最新消息管理" },
  sermons: { label: "講道／專題", title: "講道／專題管理" },
  articles: { label: "文章分享", title: "文章分享管理" },
  "standard-pages": { label: "標準頁面", title: "標準頁面管理" },
};

const pageTypeLabels: Record<PageWritingType, string> = {
  "gathering-times": "聚會時間",
  "about-beliefs": "教會信仰",
  "about-history": "教會簡史",
  "about-covenant": "教會約章",
  "about-deacons": "執事名錄",
  "about-staff": "同工名錄",
  missions: "宣教工場",
  recruitment: "招聘",
  "contact-us": "聯絡我們",
};

type Props = {
  activeSection: AdminSectionKey;
  initialNews: NewsRow[];
  initialSermons: AssemblyRow[];
  initialArticles: WritingRow[];
  initialStandardPages: WritingRow[];
};

export function AdminDashboard({
  activeSection,
  initialNews,
  initialSermons,
  initialArticles,
  initialStandardPages,
}: Props) {
  const [news, setNews] = useState<NewsRow[]>(initialNews);
  const [sermons, setSermons] = useState<AssemblyRow[]>(initialSermons);
  const [articles, setArticles] = useState<WritingRow[]>(initialArticles);
  const [standardPages, setStandardPages] = useState<WritingRow[]>(initialStandardPages);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Add-announcement form ──────────────────────────────────
  const [annForm, setAnnForm] = useState({
    title: "",
    published_at: "",
    content_text: "",
    image_url: "",
  });
  const annImageRef = useRef<HTMLInputElement>(null);

  // ── Add-sermon form ────────────────────────────────────────
  const [sermonForm, setSermonForm] = useState({
    date_iso: "",
    speaker: "",
    topic: "",
    youtube_url: "",
    wav_url: "",
  });

  // ── Add-article form ───────────────────────────────────────
  const [articleForm, setArticleForm] = useState({
    title: "",
    date_iso: "",
    author: "",
    content_text: "",
  });

  async function run<T>(fn: () => Promise<T>): Promise<T | null> {
    setBusy(true);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  // ── News handlers ──────────────────────────────────────────
  async function handleAddNews() {
    if (!annForm.title || !annForm.content_text) return;
    const row = await run(() =>
      addNewsAction({
        title: annForm.title,
        content_text: annForm.content_text,
        image_url: annForm.image_url || null,
        published_at: annForm.published_at || null,
      }),
    );
    if (row) {
      setNews((prev) => [row, ...prev]);
      setAnnForm({ title: "", published_at: "", content_text: "", image_url: "" });
      if (annImageRef.current) annImageRef.current.value = "";
    }
  }

  async function handleUploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const url = await run(() => uploadAnnouncementImageAction(fd));
    if (url) setAnnForm((p) => ({ ...p, image_url: url }));
  }

  async function handleUpdateNews(id: number, patch: Partial<NewsRow>) {
    await run(() => updateNewsAction(id, patch));
    setNews((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function handleDeleteNews(id: number) {
    await run(() => deleteNewsAction(id));
    setNews((prev) => prev.filter((item) => item.id !== id));
  }

  // ── Sermon handlers ────────────────────────────────────────
  async function handleAddSermon() {
    if (!sermonForm.speaker || !sermonForm.topic) return;
    const row = await run(() =>
      addSermonAction({
        date_iso: sermonForm.date_iso || null,
        speaker: sermonForm.speaker,
        topic: sermonForm.topic,
        youtube_url: sermonForm.youtube_url || null,
        wav_url: sermonForm.wav_url || null,
      }),
    );
    if (row) {
      setSermons((prev) => [row, ...prev]);
      setSermonForm({ date_iso: "", speaker: "", topic: "", youtube_url: "", wav_url: "" });
    }
  }

  async function handleUpdateSermon(id: number, patch: Partial<AssemblyRow>) {
    await run(() => updateSermonAction(id, patch));
    setSermons((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  async function handleDeleteSermon(id: number) {
    await run(() => deleteSermonAction(id));
    setSermons((prev) => prev.filter((item) => item.id !== id));
  }

  // ── Article handlers ───────────────────────────────────────
  async function handleAddArticle() {
    if (!articleForm.title || !articleForm.content_text) return;
    const row = await run(() =>
      addArticleAction({
        title: articleForm.title,
        content_text: articleForm.content_text,
        date_iso: articleForm.date_iso || null,
        author: articleForm.author || null,
      }),
    );
    if (row) {
      setArticles((prev) => [row, ...prev]);
      setArticleForm({ title: "", date_iso: "", author: "", content_text: "" });
    }
  }

  async function handleUpdateArticle(id: number, patch: Partial<WritingRow>) {
    await run(() => updateArticleAction(id, patch));
    setArticles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  async function handleDeleteArticle(id: number) {
    await run(() => deleteArticleAction(id));
    setArticles((prev) => prev.filter((item) => item.id !== id));
  }

  // ── Standard page handlers ─────────────────────────────────
  async function handleUpdatePage(type: PageWritingType, patch: Partial<WritingRow>) {
    await run(() => updatePageContentAction(type, patch));
    setStandardPages((prev) =>
      prev.map((item) => (item.type === type ? { ...item, ...patch } : item)),
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_minmax(0,1fr)] sm:px-6">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-500">Admin CMS</h2>
        <div className="grid gap-2">
          {adminSectionKeys.map((key) => (
            <Button key={key} variant={activeSection === key ? "secondary" : "outline"} asChild>
              <Link href={`/admin/${key}`}>{sectionMeta[key].label}</Link>
            </Button>
          ))}
        </div>
      </aside>

      <main className="space-y-4">
        <div>
          <Badge>受保護後台</Badge>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {sectionMeta[activeSection].title}
          </h1>
          <p className="text-sm text-slate-600">各管理功能均有獨立路由，方便直接引用與導覽。</p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
        )}

        {/* ── ANNOUNCEMENTS ───────────────────────────────── */}
        {activeSection === "announcements" && (
          <>
            <Card>
              <CardTitle>新增最新消息</CardTitle>
              <CardDescription>欄位：標題、日期、內容、圖片連結</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="ann-title">標題 *</Label>
                  <Input
                    id="ann-title"
                    value={annForm.title}
                    onChange={(e) => setAnnForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="ann-date">日期</Label>
                  <Input
                    id="ann-date"
                    type="date"
                    value={annForm.published_at}
                    onChange={(e) =>
                      setAnnForm((p) => ({ ...p, published_at: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ann-desc">內容 *</Label>
                  <Textarea
                    id="ann-desc"
                    rows={3}
                    value={annForm.content_text}
                    onChange={(e) =>
                      setAnnForm((p) => ({ ...p, content_text: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ann-image-url">圖片 URL（或上傳）</Label>
                  <Input
                    id="ann-image-url"
                    placeholder="https://..."
                    value={annForm.image_url}
                    onChange={(e) =>
                      setAnnForm((p) => ({ ...p, image_url: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ann-image-file">上傳圖片至 Supabase Storage</Label>
                  <Input
                    id="ann-image-file"
                    ref={annImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUploadImage(file);
                    }}
                  />
                </div>
                <Button onClick={handleAddNews} disabled={busy}>
                  新增消息
                </Button>
              </div>
            </Card>

            <div className="grid gap-3">
              {news.map((item) => (
                <Card key={item.id} className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>標題</Label>
                      <Input
                        defaultValue={item.title}
                        onBlur={(e) =>
                          void handleUpdateNews(item.id, { title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>日期</Label>
                      <Input
                        type="date"
                        defaultValue={item.published_at ?? ""}
                        onBlur={(e) =>
                          void handleUpdateNews(item.id, {
                            published_at: e.target.value || null,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>內容</Label>
                    <Textarea
                      defaultValue={item.content_text ?? ""}
                      onBlur={(e) =>
                        void handleUpdateNews(item.id, { content_text: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>圖片 URL</Label>
                    <Input
                      defaultValue={item.image_url ?? ""}
                      onBlur={(e) =>
                        void handleUpdateNews(item.id, {
                          image_url: e.target.value || null,
                        })
                      }
                    />
                  </div>
                  <Button
                    variant="destructive"
                    disabled={busy}
                    onClick={() => void handleDeleteNews(item.id)}
                  >
                    刪除
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── SERMONS ─────────────────────────────────────── */}
        {activeSection === "sermons" && (
          <>
            <Card>
              <CardTitle>新增講道／專題</CardTitle>
              <CardDescription>
                YouTube 連結或直接音頻 URL（WAV/MP3），填其中一個即可。
              </CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="sermon-speaker">講員 *</Label>
                  <Input
                    id="sermon-speaker"
                    value={sermonForm.speaker}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, speaker: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-date">日期（YYYY-MM-DD）</Label>
                  <Input
                    id="sermon-date"
                    type="date"
                    value={sermonForm.date_iso}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, date_iso: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-topic">講題 *</Label>
                  <Input
                    id="sermon-topic"
                    value={sermonForm.topic}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, topic: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-youtube">YouTube URL</Label>
                  <Input
                    id="sermon-youtube"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={sermonForm.youtube_url}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, youtube_url: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-wav">音頻 URL（WAV / MP3）</Label>
                  <Input
                    id="sermon-wav"
                    placeholder="https://..."
                    value={sermonForm.wav_url}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, wav_url: e.target.value }))
                    }
                  />
                </div>
                <Button onClick={handleAddSermon} disabled={busy}>
                  新增講道
                </Button>
              </div>
            </Card>

            <div className="grid gap-3">
              {sermons.map((item) => (
                <Card key={item.id} className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>講員</Label>
                      <Input
                        defaultValue={item.speaker ?? ""}
                        onBlur={(e) =>
                          void handleUpdateSermon(item.id, { speaker: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>日期</Label>
                      <Input
                        type="date"
                        defaultValue={item.date_iso ?? ""}
                        onBlur={(e) =>
                          void handleUpdateSermon(item.id, {
                            date_iso: e.target.value || null,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>講題</Label>
                    <Input
                      defaultValue={item.topic ?? ""}
                      onBlur={(e) =>
                        void handleUpdateSermon(item.id, { topic: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>YouTube URL</Label>
                    <Input
                      defaultValue={item.youtube_url ?? ""}
                      onBlur={(e) =>
                        void handleUpdateSermon(item.id, {
                          youtube_url: e.target.value || null,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>音頻 URL（WAV / MP3）</Label>
                    <Input
                      defaultValue={item.wav_url ?? ""}
                      onBlur={(e) =>
                        void handleUpdateSermon(item.id, {
                          wav_url: e.target.value || null,
                        })
                      }
                    />
                  </div>
                  <Button
                    variant="destructive"
                    disabled={busy}
                    onClick={() => void handleDeleteSermon(item.id)}
                  >
                    刪除
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── ARTICLES ────────────────────────────────────── */}
        {activeSection === "articles" && (
          <>
            <Card>
              <CardTitle>新增文章</CardTitle>
              <CardDescription>欄位：標題、日期、作者、內容</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="article-title">標題 *</Label>
                  <Input
                    id="article-title"
                    value={articleForm.title}
                    onChange={(e) =>
                      setArticleForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="article-date">日期</Label>
                    <Input
                      id="article-date"
                      type="date"
                      value={articleForm.date_iso}
                      onChange={(e) =>
                        setArticleForm((p) => ({ ...p, date_iso: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="article-author">作者</Label>
                    <Input
                      id="article-author"
                      value={articleForm.author}
                      onChange={(e) =>
                        setArticleForm((p) => ({ ...p, author: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="article-content">內容 *</Label>
                  <Textarea
                    id="article-content"
                    rows={5}
                    value={articleForm.content_text}
                    onChange={(e) =>
                      setArticleForm((p) => ({ ...p, content_text: e.target.value }))
                    }
                  />
                </div>
                <Button onClick={handleAddArticle} disabled={busy}>
                  發佈文章
                </Button>
              </div>
            </Card>

            <div className="grid gap-3">
              {articles.map((item) => (
                <Card key={item.id} className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>標題</Label>
                      <Input
                        defaultValue={item.title}
                        onBlur={(e) =>
                          void handleUpdateArticle(item.id, { title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>日期</Label>
                      <Input
                        type="date"
                        defaultValue={item.date_iso ?? ""}
                        onBlur={(e) =>
                          void handleUpdateArticle(item.id, {
                            date_iso: e.target.value || null,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>作者</Label>
                    <Input
                      defaultValue={item.author ?? ""}
                      onBlur={(e) =>
                        void handleUpdateArticle(item.id, { author: e.target.value || null })
                      }
                    />
                  </div>
                  <div>
                    <Label>內容</Label>
                    <Textarea
                      rows={4}
                      defaultValue={item.content_text ?? ""}
                      onBlur={(e) =>
                        void handleUpdateArticle(item.id, { content_text: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    variant="destructive"
                    disabled={busy}
                    onClick={() => void handleDeleteArticle(item.id)}
                  >
                    刪除
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── STANDARD PAGES ──────────────────────────────── */}
        {activeSection === "standard-pages" && (
          <div className="grid gap-3">
            {pageWritingTypes.map((type) => {
              const item = standardPages.find((p) => p.type === type);
              return (
                <Card key={type} className="space-y-3">
                  <CardTitle>{pageTypeLabels[type]}</CardTitle>
                  <CardDescription>路徑：/{type.replace("about-", "about/")}</CardDescription>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>標題</Label>
                      <Input
                        defaultValue={item?.title ?? ""}
                        onBlur={(e) =>
                          void handleUpdatePage(type, { title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>按鈕文字</Label>
                      <Input
                        defaultValue={item?.button_label ?? ""}
                        onBlur={(e) =>
                          void handleUpdatePage(type, { button_label: e.target.value || null })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>描述</Label>
                    <Textarea
                      rows={3}
                      defaultValue={item?.content_text ?? ""}
                      onBlur={(e) =>
                        void handleUpdatePage(type, { content_text: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>按鈕連結</Label>
                      <Input
                        defaultValue={item?.button_href ?? ""}
                        onBlur={(e) =>
                          void handleUpdatePage(type, { button_href: e.target.value || null })
                        }
                      />
                    </div>
                    <div>
                      <Label>圖片 URL</Label>
                      <Input
                        defaultValue={item?.image_url ?? ""}
                        onBlur={(e) =>
                          void handleUpdatePage(type, { image_url: e.target.value || null })
                        }
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
