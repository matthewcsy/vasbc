"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const newsItems = [
  {
    id: "n1",
    title: "兒童營",
    date: "2025-07-15",
    description: "為社區家庭而設的三天兒童營，包含遊戲、詩歌與信仰分享。",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "n2",
    title: "暑期聖經班",
    date: "2025-08-02",
    description: "透過故事劇場和手工活動，讓孩子在歡笑中認識聖經真理。",
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "n3",
    title: "福音足球挑戰盃",
    date: "2025-09-13",
    description: "教會與社區青年一同參與友誼賽，場邊設有福音分享與禱告站。",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  const [activeNews, setActiveNews] = useState<(typeof newsItems)[number] | null>(
    null,
  );

  return (
    <div className="space-y-14 pb-10">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pt-8 sm:px-6 lg:grid-cols-2 lg:pt-14">
        <motion.div
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
            <Button>參與聚會</Button>
            <Button variant="outline">聯絡我們</Button>
          </div>
        </motion.div>

        <motion.div
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">最新消息</h2>
          <p className="text-sm text-slate-500">點擊卡片查看詳情</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, idx) => (
            <motion.button
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
              <Image
                src={item.image}
                alt={item.title}
                width={1000}
                height={700}
                className="h-44 w-full object-cover"
              />
              <div className="p-4">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.date}</CardDescription>
                <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                  {item.description}
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
                <p className="mt-1 text-sm text-slate-500">{activeNews.date}</p>
                <p className="mt-3 text-sm text-slate-700">
                  {activeNews.description}
                </p>
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Card className="overflow-hidden bg-white">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3">
              <iframe
                title="最新講道"
                src="https://www.youtube.com/embed/ysz5S6PUM-U"
                className="h-72 w-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
            <div className="space-y-3 p-2">
              <Badge>講道／專題</Badge>
              <CardTitle>最新講道：扎根聖言，生命更新</CardTitle>
              <CardDescription>講員：王傳道 ・ 日期：2025-10-05</CardDescription>
              <audio controls className="mt-2 w-full">
                <source
                  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                  type="audio/mpeg"
                />
              </audio>
              <p className="text-sm text-slate-600">
                可播放影片與音訊，作為最新講道與專題內容展示。
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
