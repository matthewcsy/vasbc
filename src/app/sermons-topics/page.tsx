import { Music } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getAssembly } from "@/lib/cms-storage";
import type { AssemblyRow } from "@/lib/cms-schema";

/** Extract a YouTube video ID from various URL formats */
function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function SermonMedia({ item }: { item: AssemblyRow }) {
  // YouTube URL — embed iframe
  if (item.youtube_url) {
    const videoId = getYouTubeId(item.youtube_url);
    const embedSrc = videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : item.youtube_url;
    return (
      <iframe
        title={item.topic ?? ""}
        src={embedSrc}
        className="h-48 w-full rounded-xl border border-slate-200 bg-slate-100"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  // WAV streaming URL — native audio player
  if (item.wav_url) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <Music className="h-8 w-8 text-slate-400" />
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio controls src={item.wav_url} className="w-full" />
      </div>
    );
  }

  // Audio MP3 path present but not a web URL — show placeholder
  return (
    <div className="flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
      <Music className="h-8 w-8 text-slate-400" />
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function SermonsTopicsPage() {
  const sermons = await getAssembly();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <Badge>講道／專題</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">講道／專題</h1>
        <p className="mt-2 text-slate-600">收錄教會最新講道與專題分享影音資源。</p>
      </div>
      <div className="grid gap-4">
        {sermons.map((item) => (
          <Card key={item.id}>
            <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
              <SermonMedia item={item} />
              <div className="space-y-2">
                <CardTitle>{item.topic ?? ""}</CardTitle>
                <CardDescription>
                  {item.speaker && <>講員：{item.speaker} ・ </>}
                  日期：{item.date_iso ?? item.date ?? ""}
                </CardDescription>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

