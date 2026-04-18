"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCmsData } from "@/lib/cms-storage";
import type {
  Announcement,
  Article,
  Sermon,
  StandardPageContent,
} from "@/lib/cms-schema";

export const adminSectionKeys = [
  "announcements",
  "sermons",
  "articles",
  "standard-pages",
] as const;

export type AdminSectionKey = (typeof adminSectionKeys)[number];

const sectionMeta: Record<AdminSectionKey, { label: string; title: string }> = {
  announcements: { label: "最新消息", title: "最新消息管理" },
  sermons: { label: "講道／專題", title: "講道／專題管理" },
  articles: { label: "文章分享", title: "文章分享管理" },
  "standard-pages": { label: "標準頁面", title: "標準頁面管理" },
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type Props = {
  activeSection: AdminSectionKey;
};

export function AdminDashboard({ activeSection }: Props) {
  const { data, updateData } = useCmsData();

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    date: "",
    description: "",
    imageName: "",
    imageUrl: "",
  });
  const [sermonForm, setSermonForm] = useState({
    preacher: "",
    date: "",
    topic: "",
    mediaUrl: "",
  });
  const [articleForm, setArticleForm] = useState({
    title: "",
    date: "",
    content: "",
  });

  const sectionTitle = useMemo(() => sectionMeta[activeSection].title, [activeSection]);

  const updateAnnouncement = (id: string, patch: Partial<Announcement>) => {
    updateData((previous) => ({
      ...previous,
      announcements: previous.announcements.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const updateSermon = (id: string, patch: Partial<Sermon>) => {
    updateData((previous) => ({
      ...previous,
      sermons: previous.sermons.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateArticle = (id: string, patch: Partial<Article>) => {
    updateData((previous) => ({
      ...previous,
      articles: previous.articles.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateStandardPage = (key: string, patch: Partial<StandardPageContent>) => {
    updateData((previous) => ({
      ...previous,
      standardPages: previous.standardPages.map((item) =>
        item.key === key ? { ...item, ...patch } : item,
      ),
    }));
  };

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
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{sectionTitle}</h1>
          <p className="text-sm text-slate-600">
            各管理功能均有獨立路由，方便直接引用與導覽。
          </p>
        </div>

        {activeSection === "announcements" && (
          <>
            <Card>
              <CardTitle>新增最新消息</CardTitle>
              <CardDescription>欄位：標題、日期、內容、圖片上傳</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="ann-title">標題</Label>
                  <Input
                    id="ann-title"
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ann-date">日期</Label>
                  <Input
                    id="ann-date"
                    type="date"
                    value={announcementForm.date}
                    onChange={(e) =>
                      setAnnouncementForm((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ann-desc">內容</Label>
                  <Textarea
                    id="ann-desc"
                    rows={3}
                    value={announcementForm.description}
                    onChange={(e) =>
                      setAnnouncementForm((p) => ({ ...p, description: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ann-image">圖片上傳</Label>
                  <Input
                    id="ann-image"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const imageUrl = await fileToDataUrl(file);
                      setAnnouncementForm((p) => ({
                        ...p,
                        imageName: file.name,
                        imageUrl,
                      }));
                    }}
                  />
                </div>
                <Button
                  onClick={() => {
                    if (
                      !announcementForm.title ||
                      !announcementForm.date ||
                      !announcementForm.description
                    )
                      return;
                    updateData((previous) => ({
                      ...previous,
                      announcements: [
                        { id: crypto.randomUUID(), ...announcementForm },
                        ...previous.announcements,
                      ],
                    }));
                    setAnnouncementForm({
                      title: "",
                      date: "",
                      description: "",
                      imageName: "",
                      imageUrl: "",
                    });
                  }}
                >
                  新增消息
                </Button>
              </div>
            </Card>

            <div className="grid gap-3">
              {data.announcements.map((item) => (
                <Card key={item.id} className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>標題</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateAnnouncement(item.id, { title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>日期</Label>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateAnnouncement(item.id, { date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>內容</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateAnnouncement(item.id, { description: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      className="max-w-md"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const imageUrl = await fileToDataUrl(file);
                        updateAnnouncement(item.id, { imageName: file.name, imageUrl });
                      }}
                    />
                    <Button
                      variant="destructive"
                      onClick={() =>
                        updateData((previous) => ({
                          ...previous,
                          announcements: previous.announcements.filter(
                            (announcement) => announcement.id !== item.id,
                          ),
                        }))
                      }
                    >
                      刪除
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeSection === "sermons" && (
          <>
            <Card>
              <CardTitle>新增講道／專題</CardTitle>
              <CardDescription>欄位：講員、日期、講題、Audio/Video URL</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="sermon-preacher">講員</Label>
                  <Input
                    id="sermon-preacher"
                    value={sermonForm.preacher}
                    onChange={(e) => setSermonForm((p) => ({ ...p, preacher: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-date">日期</Label>
                  <Input
                    id="sermon-date"
                    type="date"
                    value={sermonForm.date}
                    onChange={(e) => setSermonForm((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-topic">講題</Label>
                  <Input
                    id="sermon-topic"
                    value={sermonForm.topic}
                    onChange={(e) => setSermonForm((p) => ({ ...p, topic: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-url">Audio/Video URL</Label>
                  <Input
                    id="sermon-url"
                    value={sermonForm.mediaUrl}
                    onChange={(e) => setSermonForm((p) => ({ ...p, mediaUrl: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={() => {
                    if (
                      !sermonForm.preacher ||
                      !sermonForm.date ||
                      !sermonForm.topic ||
                      !sermonForm.mediaUrl
                    )
                      return;
                    updateData((previous) => ({
                      ...previous,
                      sermons: [{ id: crypto.randomUUID(), ...sermonForm }, ...previous.sermons],
                    }));
                    setSermonForm({ preacher: "", date: "", topic: "", mediaUrl: "" });
                  }}
                >
                  新增講道
                </Button>
              </div>
            </Card>

            <div className="grid gap-3">
              {data.sermons.map((item) => (
                <Card key={item.id} className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>講員</Label>
                      <Input
                        value={item.preacher}
                        onChange={(e) => updateSermon(item.id, { preacher: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>日期</Label>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateSermon(item.id, { date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>講題</Label>
                    <Input
                      value={item.topic}
                      onChange={(e) => updateSermon(item.id, { topic: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Audio/Video URL</Label>
                    <Input
                      value={item.mediaUrl}
                      onChange={(e) => updateSermon(item.id, { mediaUrl: e.target.value })}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      updateData((previous) => ({
                        ...previous,
                        sermons: previous.sermons.filter((sermon) => sermon.id !== item.id),
                      }))
                    }
                  >
                    刪除
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeSection === "articles" && (
          <>
            <Card>
              <CardTitle>新增文章</CardTitle>
              <CardDescription>欄位：標題、日期、內容</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="article-title">標題</Label>
                  <Input
                    id="article-title"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="article-date">日期</Label>
                  <Input
                    id="article-date"
                    type="date"
                    value={articleForm.date}
                    onChange={(e) => setArticleForm((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="article-content">內容</Label>
                  <Textarea
                    id="article-content"
                    rows={5}
                    value={articleForm.content}
                    onChange={(e) => setArticleForm((p) => ({ ...p, content: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={() => {
                    if (!articleForm.title || !articleForm.date || !articleForm.content) return;
                    updateData((previous) => ({
                      ...previous,
                      articles: [{ id: crypto.randomUUID(), ...articleForm }, ...previous.articles],
                    }));
                    setArticleForm({ title: "", date: "", content: "" });
                  }}
                >
                  發佈文章
                </Button>
              </div>
            </Card>

            <div className="grid gap-3">
              {data.articles.map((item) => (
                <Card key={item.id} className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>標題</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateArticle(item.id, { title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>日期</Label>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateArticle(item.id, { date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>內容</Label>
                    <Textarea
                      rows={5}
                      value={item.content}
                      onChange={(e) => updateArticle(item.id, { content: e.target.value })}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      updateData((previous) => ({
                        ...previous,
                        articles: previous.articles.filter((article) => article.id !== item.id),
                      }))
                    }
                  >
                    刪除
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeSection === "standard-pages" && (
          <div className="grid gap-3">
            {data.standardPages.map((item) => (
              <Card key={item.key} className="space-y-3">
                <CardTitle>{item.path}</CardTitle>
                <CardDescription>可更新標題、內文、圖片與按鈕設定。</CardDescription>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label>標題</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateStandardPage(item.key, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>按鈕文字</Label>
                    <Input
                      value={item.button?.label ?? ""}
                      onChange={(e) =>
                        updateStandardPage(item.key, {
                          button: {
                            label: e.target.value,
                            href: item.button?.href ?? "",
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>描述</Label>
                  <Textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => updateStandardPage(item.key, { description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>按鈕連結</Label>
                  <Input
                    value={item.button?.href ?? ""}
                    onChange={(e) =>
                      updateStandardPage(item.key, {
                        button: {
                          label: item.button?.label ?? "",
                          href: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="max-w-md"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const imageUrl = await fileToDataUrl(file);
                    updateStandardPage(item.key, { imageName: file.name, imageUrl });
                  }}
                />
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
