import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getNewsByCategory } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

export default async function MangroveSpacePage() {
  const mangroveNews = await getNewsByCategory("mangrove");
  const latestMangrove = mangroveNews.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <section className="grid gap-6 rounded-3xl bg-[#f8f5ef] p-6 shadow-sm lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Badge className="bg-[#e8dcc7] text-[#775b32]">木川共享空間</Badge>
          <h1 className="mt-4 text-3xl font-semibold text-[#3a2a16]">
            Mangrove Space
          </h1>
          <p className="mt-3 text-[#5c4830]">
            以咖啡館與共享工作空間為靈感，打造明亮、開放、包容的社區場域。
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80"
            alt="Mangrove Space interior"
            width={1200}
            height={800}
            className="h-64 w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {/* Instagram widget */}
        <Card className="bg-white">
          <CardTitle>IG/FB Social Feed</CardTitle>
          <CardDescription>
            @mangrove_space 的最新動態
          </CardDescription>
          <div className="mt-4">
            {/* Elfsight Instagram Feed widget — replace the class attribute with
                your widget ID from https://elfsight.com after signing up.
                Then add their script tag to app/layout.tsx:
                <Script src="https://static.elfsight.com/platform/platform.js" strategy="lazyOnload" /> */}
            <div
              className="elfsight-app-REPLACE_WITH_YOUR_WIDGET_ID"
              data-elfsight-app-lazy
            />
            <p className="mt-3 text-xs text-slate-400">
              <a
                href="https://www.instagram.com/mangrove_space/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-600"
              >
                在 Instagram 上關注 @mangrove_space ↗
              </a>
            </p>
          </div>
        </Card>

        {/* Mangrove announcements */}
        <Card className="bg-white">
          <CardTitle>木川消息</CardTitle>
          <CardDescription>木川共享空間最新消息</CardDescription>
          {latestMangrove.length === 0 ? (
            <div className="mt-4 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              暫無消息
            </div>
          ) : (
            <div className="mt-3 grid gap-2">
              {latestMangrove.map((item) => (
                <Link
                  key={item.id}
                  href={`/announcements/${item.id}`}
                  className="block rounded-xl border border-[#E8E1D3] bg-[#FDFBF7] p-3 transition-colors hover:border-[#C8B89A]"
                >
                  <p className="line-clamp-1 text-sm font-medium text-[#2D2421]">{item.title}</p>
                  {item.published_at && (
                    <p className="mt-0.5 text-xs text-[#6B5C52]">{item.published_at}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
