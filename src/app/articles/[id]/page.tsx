import { notFound } from "next/navigation";

import { WritingDetail } from "@/components/writing-detail";
import { getWritingById } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const article = await getWritingById(numericId);
  if (!article || article.type !== "article") notFound();

  return (
    <WritingDetail
      writing={article}
      defaultTitle={article.title}
      badge="文章分享"
      backHref="/articles"
      backLabel="返回文章列表"
    />
  );
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const article = await getWritingById(numericId);
  if (!article || article.type !== "article") notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/articles">
            <ChevronLeft className="mr-1 h-4 w-4" />
            返回文章列表
          </Link>
        </Button>
      </div>

      <Badge>文章分享</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">{article.title}</h1>

      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
        {(article.date_iso ?? article.date) && (
          <span>{article.date_iso ?? article.date}</span>
        )}
        {article.author && <span>作者：{article.author}</span>}
      </div>

      <div className="mt-8">
        {article.content_html ? (
          <div
            className="prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />
        ) : (
          <p className="whitespace-pre-wrap text-slate-700">{article.content_text ?? ""}</p>
        )}
      </div>
    </div>
  );
}
