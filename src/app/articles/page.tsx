import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { getWritingsByTypePaginated } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

function toSnippet(text: string | null, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { data: articles, total } = await getWritingsByTypePaginated("article", page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const hero = page === 1 ? (articles.at(0) ?? null) : null;
  const gridItems = page === 1 ? articles.slice(1) : articles;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <Badge>文章分享</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">文章分享</h1>
        <p className="mt-2 text-slate-600">發佈教會靈修文章、見證分享與社區關懷內容。</p>
      </div>

      {hero && (
        <Link href={`/articles/${hero.id}`} className="block">
          <Card className="border-emerald-200 bg-emerald-50/40 transition-colors hover:border-emerald-300 hover:bg-emerald-50/60">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
              最新文章
            </p>
            <CardTitle className="mt-2 text-xl">{hero.title}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {hero.date_iso ?? hero.date ?? ""}
              {hero.author && ` · ${hero.author}`}
            </p>
            <p className="mt-3 text-slate-700">{toSnippet(hero.content_text, 200)}</p>
          </Card>
        </Link>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gridItems.map((item) => (
          <Link key={item.id} href={`/articles/${item.id}`} className="block h-full">
            <Card className="h-full cursor-pointer transition-colors hover:border-slate-300 hover:bg-slate-50/50">
              <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              <CardDescription className="mt-1">
                {item.date_iso ?? item.date ?? ""}
                {item.author && ` · ${item.author}`}
              </CardDescription>
              <p className="mt-2 text-sm text-slate-700">{toSnippet(item.content_text)}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/articles" />
    </div>
  );
}
