import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { getNewsPaginated } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { data: news, total } = await getNewsPaginated(page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <Badge>最新消息</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">最新消息</h1>
        <p className="mt-2 text-slate-600">完整消息列表。共 {total} 則消息。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <Card key={item.id} className="overflow-hidden p-0">
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
              <p className="mt-2 text-sm text-slate-700">{item.content_text ?? ""}</p>
            </div>
          </Card>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} basePath="/announcements" />
    </div>
  );
}
