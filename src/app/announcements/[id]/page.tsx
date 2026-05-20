import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNewsById } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const item = await getNewsById(numericId);
  if (!item) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/announcements">
            <ChevronLeft className="mr-1 h-4 w-4" />
            返回最新消息
          </Link>
        </Button>
      </div>

      {item.image_url && (
        <div className="mb-6 overflow-hidden rounded-2xl">
          <Image
            src={item.image_url}
            alt={item.title}
            width={1200}
            height={675}
            className="h-72 w-full object-cover"
            priority
          />
        </div>
      )}

      <Badge>最新消息</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">{item.title}</h1>

      {item.published_at && (
        <p className="mt-2 text-sm text-slate-500">{item.published_at}</p>
      )}

      {item.content_html ? (
        <div
          className="prose prose-slate mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: item.content_html }}
        />
      ) : (
        <p className="mt-6 whitespace-pre-wrap text-slate-700">{item.content_text ?? ""}</p>
      )}
    </div>
  );
}
