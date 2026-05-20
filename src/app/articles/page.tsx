import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getWritingsByType } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

function toSnippet(text: string | null, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export default async function ArticlesPage() {
  const articles = await getWritingsByType("article");
  const latest = articles.at(0) ?? null;

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
          <p className="mt-1 text-sm text-slate-500">{latest.date_iso ?? latest.date ?? ""}</p>
          <p className="mt-3 text-sm text-slate-700">{toSnippet(latest.content_text, 180)}</p>
        </Card>
      )}

      <div className="grid gap-3">
        {articles.map((item) => (
          <Card key={item.id}>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.date_iso ?? item.date ?? ""}</CardDescription>
            <p className="mt-2 text-sm text-slate-700">{toSnippet(item.content_text)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
