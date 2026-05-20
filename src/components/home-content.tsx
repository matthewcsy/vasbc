"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { NewsRow, AssemblyRow } from "@/lib/cms-schema";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

type Props = {
  featuredNews: NewsRow[];
  featuredSermons: AssemblyRow[];
};

export function HomeContent({ featuredNews, featuredSermons }: Props) {
  const latestSermon = featuredSermons.at(0) ?? null;
  const [activeNews, setActiveNews] = useState<NewsRow | null>(null);

  return (
    <div className="space-y-14 pb-10">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        id="home-hero"
        className="mx-auto grid max-w-7xl gap-6 px-4 pt-8 sm:px-6 lg:grid-cols-2 lg:pt-14"
      >
        <motion.div
          id="hero-intro"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-white p-8 shadow-sm"
        >
          <Badge>主頁</Badge>
          <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            勝利道潮語浸信會
          </h1>
          <p className="mt-3 text-slate-600">
            與社區同行，在聖言中扎根，在禱告中守望，在團契中彼此建立。
          </p>
          <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            2025至2026雙年度教會主題：扎根聖言，禱告守望，團契生活，見證福音
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button id="hero-join-button" asChild>
              <Link href="/gathering-times">參與聚會</Link>
            </Button>
            <Button id="hero-contact-button" variant="outline" asChild>
              <Link href="/contact-us">聯絡我們</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          id="hero-mangrove"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-emerald-950 p-8 text-white shadow-sm"
        >
          <p className="text-sm text-emerald-100">木川共享空間</p>
          <h2 className="mt-3 text-3xl font-semibold">Mangrove Space</h2>
          <p className="mt-3 max-w-md text-emerald-100">
            一個溫暖且現代的社區空間，讓不同年齡的朋友能交流、學習與同行。
          </p>
          <div className="mt-6 h-56 overflow-hidden rounded-2xl border border-white/20">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
              alt="木川共享空間"
              width={1200}
              height={700}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* ── Latest News ──────────────────────────────────────── */}
      <section id="latest-news-section" className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 id="latest-news-title" className="text-2xl font-semibold text-slate-900">
              最新消息
            </h2>
            <p className="text-sm text-slate-500">點擊卡片查看詳情</p>
          </div>
          <Button id="latest-news-view-all-button" variant="outline" asChild>
            <Link href="/announcements">查看全部</Link>
          </Button>
        </div>
        <div id="latest-news-cards" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredNews.map((item, idx) => (
            <motion.button
              id={`latest-news-card-${item.id}`}
              type="button"
              key={item.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: `${idx * 80}ms` }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm"
              onClick={() => setActiveNews(item)}
            >
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={1000}
                  height={700}
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="p-4">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.published_at ?? ""}</CardDescription>
                <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                  {item.content_text ?? ""}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {activeNews && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNews(null)}
            >
              <motion.div
                className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl"
                initial={{ scale: 0.95, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 12 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold">{activeNews.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{activeNews.published_at ?? ""}</p>
                <p className="mt-3 text-sm text-slate-700">{activeNews.content_text ?? ""}</p>
                <div className="mt-5 flex justify-end">
                  <Button variant="outline" onClick={() => setActiveNews(null)}>
                    關閉
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Latest Sermons ───────────────────────────────────── */}
      <section id="latest-sermons-section" className="mx-auto max-w-7xl px-4 sm:px-6">
        <Card className="overflow-hidden bg-white">
          <div className="grid gap-4 p-2 md:grid-cols-2 lg:grid-cols-3">
            {featuredSermons.map((item) => {
              const youtubeId = item.youtube_url ? getYouTubeId(item.youtube_url) : null;
              return (
                <div
                  id={`latest-sermon-card-${item.id}`}
                  key={item.id}
                  className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3"
                >
                  {youtubeId ? (
                    <iframe
                      title={item.topic ?? ""}
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="h-44 w-full rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : item.wav_url ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <audio controls src={item.wav_url} className="w-full" />
                  ) : (
                    <div className="flex h-44 items-center justify-center rounded-xl bg-slate-100 text-slate-400 text-sm">
                      音頻未提供
                    </div>
                  )}
                  <Badge>講道／專題</Badge>
                  <CardTitle>{item.topic ?? ""}</CardTitle>
                  <CardDescription>
                    {item.speaker && <>講員：{item.speaker} ・ </>}
                    日期：{item.date_iso ?? item.date ?? ""}
                  </CardDescription>
                </div>
              );
            })}
          </div>
          {latestSermon && (
            <div className="border-t border-slate-200 p-4">
              <p className="text-sm text-slate-600">
                最新講道：{latestSermon.topic}（{latestSermon.date_iso ?? latestSermon.date ?? ""}）
              </p>
              <Button
                id="latest-sermons-view-all-button"
                className="mt-3"
                variant="outline"
                asChild
              >
                <Link href="/sermons-topics">查看全部講道</Link>
              </Button>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
