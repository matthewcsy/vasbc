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
  return `${text.slice(0, maxLength).trim()}\u2026`;
}

export default async function MissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { data: reports, total } = await getWritingsByTypePaginated(
    "missionary",
    page,
    PAGE_SIZE,
  );
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const hero = page === 1 ? (reports.at(0) ?? null) : null;
  const gridItems = page === 1 ? reports.slice(1) : reports;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <Badge>\u5ba3\u6559\u5de5\u5834</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">\u5ba3\u6559\u5de5\u5834</h1>
        <p className="mt-2 text-slate-600">
          \u5c55\u793a\u672c\u5730\u8207\u6d77\u5916\u5ba3\u6559\u5de5\u5834\u8fd1\u6cc1\u3001\u4ee3\u7977\u4e8b\u9805\u8207\u53c3\u8207\u65b9\u5f0f\u3002
        </p>
      </div>

      {hero ? (
        <Link href={`/missions/${hero.id}`} className="block">
          <Card className="border-amber-200 bg-amber-50/40 transition-colors hover:border-amber-300 hover:bg-amber-50/60">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
              \u6700\u65b0\u5831\u5bfc
            </p>
            <CardTitle className="mt-2 text-xl">{hero.title}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {hero.date_iso ?? hero.date ?? ""}
              {hero.author && ` \u00b7 ${hero.author}`}
            </p>
            <p className="mt-3 text-slate-700">{toSnippet(hero.content_text, 200)}</p>
          </Card>
        </Link>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">\u5ba3\u6559\u5de5\u5834\u8cc7\u8a0a\u6b63\u5728\u6574\u7406\u4e2d\uff0c\u656c\u8acb\u671f\u5f85\u3002</p>
        </div>
      )}

      {gridItems.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((item) => (
            <Link key={item.id} href={`/missions/${item.id}`} className="block h-full">
              <Card className="h-full cursor-pointer transition-colors hover:border-slate-300 hover:bg-slate-50/50">
                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="mt-1">
                  {item.date_iso ?? item.date ?? ""}
                  {item.author && ` \u00b7 ${item.author}`}
                </CardDescription>
                <p className="mt-2 text-sm text-slate-700">{toSnippet(item.content_text)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/missions" />
    </div>
  );
}

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <Badge>{page?.title ?? "宣教工場"}</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-[#2D2421]">
        {page?.title ?? "宣教工場"}
      </h1>
      <p className="mt-3 max-w-3xl text-[#4A3B32]">
        {page?.content_text ?? "展示本地與海外宣教工場近況、代禱事項與參與方式。"}
      </p>

      {page?.content_html ? (
        <div
          className="prose prose-stone mt-6 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: page.content_html }}
        />
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-[#C8B8A8] bg-[#FAF8F5] p-8 text-center text-[#4A3B32]">
          <p className="text-sm">宣教工場資訊正在整理中，敬請期待。</p>
          <p className="mt-1 text-xs text-[#7A6A5A]">管理員可透過後台新增相關內容。</p>
        </div>
      )}

      {page?.image_url && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#E8E1D3]">
          <Image
            src={page.image_url}
            alt="宣教工場"
            width={1200}
            height={720}
            className="h-72 w-full object-cover"
          />
        </div>
      )}

      {page?.button_label && page.button_href && (
        <div className="mt-6">
          <Button asChild>
            <Link href={page.button_href}>{page.button_label}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
