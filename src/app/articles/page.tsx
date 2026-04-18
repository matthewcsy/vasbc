"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useCmsData } from "@/lib/cms-storage";

function toSnippet(content: string, maxLength = 120) {
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength).trim()}…`;
}

export default function ArticlesPage() {
  const {
    data: { articles },
  } = useCmsData();

  const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sortedArticles[0];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <Badge>文章分享</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">文章分享</h1>
        <p className="mt-2 text-slate-600">發佈教會靈修文章、見證分享與社區關懷內容。</p>
      </div>

      {latest && (
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardDescription>最新文章</CardDescription>
          <CardTitle className="mt-2">{latest.title}</CardTitle>
          <p className="mt-1 text-sm text-slate-500">{latest.date}</p>
          <p className="mt-3 text-sm text-slate-700">{toSnippet(latest.content, 180)}</p>
        </Card>
      )}

      <div className="grid gap-3">
        {sortedArticles.map((item) => (
          <Card key={item.id}>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.date}</CardDescription>
            <p className="mt-2 text-sm text-slate-700">{toSnippet(item.content)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
