"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useCmsData } from "@/lib/cms-storage";

export default function SermonsTopicsPage() {
  const {
    data: { sermons },
  } = useCmsData();

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
              <iframe
                title={item.topic}
                src={item.mediaUrl}
                className="h-56 w-full rounded-xl border border-slate-200 bg-slate-100"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
              <div className="space-y-2">
                <CardTitle>{item.topic}</CardTitle>
                <CardDescription>
                  講員：{item.preacher} ・ 日期：{item.date}
                </CardDescription>
                <p className="text-sm text-slate-600">{item.mediaUrl}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
