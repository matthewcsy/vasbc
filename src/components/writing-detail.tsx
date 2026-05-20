import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WritingRow } from "@/lib/cms-schema";

/**
 * Shared single-item view for writings — used by article/mission detail pages
 * and by semi-dynamic CMS pages (/contact-us, /about/*, etc.).
 *
 * Pass `backHref` to show a back button (for list → detail navigation).
 * Omit it for top-level CMS pages.
 */
export function WritingDetail({
  writing,
  defaultTitle,
  defaultDescription,
  badge,
  backHref,
  backLabel = "返回",
}: {
  writing: WritingRow | null;
  defaultTitle: string;
  defaultDescription?: string;
  badge?: string;
  backHref?: string;
  backLabel?: string;
}) {
  const title = writing?.title ?? defaultTitle;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      {backHref && (
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={backHref}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        </div>
      )}

      <Badge>{badge ?? title}</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">{title}</h1>

      {(writing?.date_iso || writing?.date || writing?.author) && (
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
          {(writing.date_iso ?? writing.date) && (
            <span>{writing.date_iso ?? writing.date}</span>
          )}
          {writing.author && <span>作者：{writing.author}</span>}
        </div>
      )}

      {writing?.image_url && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <Image
            src={writing.image_url}
            alt={title}
            width={1200}
            height={720}
            className="h-72 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-6">
        {writing?.content_html ? (
          <div
            className="prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: writing.content_html }}
          />
        ) : (
          <p className="whitespace-pre-wrap text-slate-700">
            {writing?.content_text ?? defaultDescription ?? ""}
          </p>
        )}
      </div>

      {writing?.button_label && writing.button_href && (
        <div className="mt-6">
          <Button asChild>
            <Link href={writing.button_href}>{writing.button_label}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
