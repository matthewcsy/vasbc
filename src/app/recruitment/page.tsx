import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPageContent } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
  const page = await getPageContent("recruitment");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <Badge>{page?.title ?? "招聘"}</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-[#2D2421]">
        {page?.title ?? "招聘"}
      </h1>
      <p className="mt-3 max-w-3xl text-[#4A3B32]">
        {page?.content_text ?? "刊登教會及木川共享空間相關職位招聘資訊。"}
      </p>

      {page?.content_html ? (
        <div
          className="prose prose-stone mt-6 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: page.content_html }}
        />
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-[#C8B8A8] bg-[#FAF8F5] p-8 text-center text-[#4A3B32]">
          <p className="text-sm">目前暫無招聘職位，請定期回來查看最新資訊。</p>
          <p className="mt-1 text-xs text-[#7A6A5A]">管理員可透過後台新增相關內容。</p>
        </div>
      )}

      {page?.image_url && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#E8E1D3]">
          <Image
            src={page.image_url}
            alt="招聘"
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
