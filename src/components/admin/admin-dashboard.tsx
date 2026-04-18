"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultAnnouncements,
  defaultArticles,
  defaultSermons,
  type Announcement,
  type Article,
  type Sermon,
} from "@/lib/cms-schema";

type Section = "announcements" | "sermons" | "articles";

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("announcements");

  const [announcements, setAnnouncements] =
    useState<Announcement[]>(defaultAnnouncements);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    date: "",
    description: "",
    imageName: "",
  });

  const [sermons, setSermons] = useState<Sermon[]>(defaultSermons);
  const [sermonForm, setSermonForm] = useState({
    preacher: "",
    date: "",
    topic: "",
    mediaUrl: "",
  });

  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [articleForm, setArticleForm] = useState({
    title: "",
    date: "",
    content: "",
  });

  const sectionTitle = useMemo(() => {
    if (activeSection === "announcements") return "最新消息管理";
    if (activeSection === "sermons") return "講道／專題管理";
    return "文章分享管理";
  }, [activeSection]);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_minmax(0,1fr)] sm:px-6">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-500">Admin CMS</h2>
        <div className="grid gap-2">
          <Button
            variant={activeSection === "announcements" ? "secondary" : "outline"}
            onClick={() => setActiveSection("announcements")}
          >
            最新消息
          </Button>
          <Button
            variant={activeSection === "sermons" ? "secondary" : "outline"}
            onClick={() => setActiveSection("sermons")}
          >
            講道／專題
          </Button>
          <Button
            variant={activeSection === "articles" ? "secondary" : "outline"}
            onClick={() => setActiveSection("articles")}
          >
            文章分享
          </Button>
        </div>
      </aside>

      <main className="space-y-4">
        <div>
          <Badge>受保護後台</Badge>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {sectionTitle}
          </h1>
          <p className="text-sm text-slate-600">
            可直接進行新增、編輯、刪除（CRUD）操作。若設定 Supabase
            環境變數，可延伸接上資料庫。
          </p>
        </div>

        {activeSection === "announcements" && (
          <>
            <Card>
              <CardTitle>Announcements Board（最新消息）</CardTitle>
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
                      setAnnouncementForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ann-image">圖片上傳</Label>
                  <Input
                    id="ann-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setAnnouncementForm((p) => ({
                        ...p,
                        imageName: e.target.files?.[0]?.name ?? "",
                      }))
                    }
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
                    setAnnouncements((prev) => [
                      { id: crypto.randomUUID(), ...announcementForm },
                      ...prev,
                    ]);
                    setAnnouncementForm({
                      title: "",
                      date: "",
                      description: "",
                      imageName: "",
                    });
                  }}
                >
                  新增消息
                </Button>
              </div>
            </Card>
            <div className="grid gap-3">
              {announcements.map((item) => (
                <Card key={item.id} className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                    <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                    {item.imageName && (
                      <p className="mt-1 text-xs text-slate-500">
                        圖片：{item.imageName}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setAnnouncements((prev) =>
                        prev.filter((it) => it.id !== item.id),
                      )
                    }
                  >
                    刪除
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeSection === "sermons" && (
          <>
            <Card>
              <CardTitle>Sermons Upload（講道／專題）</CardTitle>
              <CardDescription>
                欄位：講員、日期、講題、Audio/Video URL
              </CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="sermon-preacher">講員</Label>
                  <Input
                    id="sermon-preacher"
                    value={sermonForm.preacher}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, preacher: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-date">日期</Label>
                  <Input
                    id="sermon-date"
                    type="date"
                    value={sermonForm.date}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-topic">講題</Label>
                  <Input
                    id="sermon-topic"
                    value={sermonForm.topic}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, topic: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sermon-url">Audio/Video URL</Label>
                  <Input
                    id="sermon-url"
                    value={sermonForm.mediaUrl}
                    onChange={(e) =>
                      setSermonForm((p) => ({ ...p, mediaUrl: e.target.value }))
                    }
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
                    setSermons((prev) => [
                      { id: crypto.randomUUID(), ...sermonForm },
                      ...prev,
                    ]);
                    setSermonForm({
                      preacher: "",
                      date: "",
                      topic: "",
                      mediaUrl: "",
                    });
                  }}
                >
                  新增講道
                </Button>
              </div>
            </Card>
            <div className="grid gap-3">
              {sermons.map((item) => (
                <Card key={item.id} className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{item.topic}</CardTitle>
                    <CardDescription>
                      {item.preacher} ・ {item.date}
                    </CardDescription>
                    <p className="mt-2 truncate text-sm text-slate-700">
                      {item.mediaUrl}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setSermons((prev) => prev.filter((it) => it.id !== item.id))
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
              <CardTitle>Articles（文章分享）</CardTitle>
              <CardDescription>Rich-text editor setup（contentEditable）</CardDescription>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="article-title">標題</Label>
                  <Input
                    id="article-title"
                    value={articleForm.title}
                    onChange={(e) =>
                      setArticleForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="article-date">日期</Label>
                  <Input
                    id="article-date"
                    type="date"
                    value={articleForm.date}
                    onChange={(e) =>
                      setArticleForm((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>內容（Rich Text）</Label>
                  <div
                    className="min-h-36 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) =>
                      setArticleForm((p) => ({
                        ...p,
                        content: (e.target as HTMLDivElement).textContent ?? "",
                      }))
                    }
                  />
                </div>
                <Button
                  onClick={() => {
                    if (!articleForm.title || !articleForm.date || !articleForm.content)
                      return;
                    setArticles((prev) => [
                      { id: crypto.randomUUID(), ...articleForm },
                      ...prev,
                    ]);
                    setArticleForm({
                      title: "",
                      date: "",
                      content: "",
                    });
                  }}
                >
                  發佈文章
                </Button>
              </div>
            </Card>
            <div className="grid gap-3">
              {articles.map((item) => (
                <Card key={item.id} className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                    <p className="mt-2 text-sm text-slate-700">{item.content}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setArticles((prev) => prev.filter((it) => it.id !== item.id))
                    }
                  >
                    刪除
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
