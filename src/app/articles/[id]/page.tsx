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
