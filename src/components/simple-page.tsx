import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPageContent } from "@/lib/cms-storage";
import type { PageWritingType } from "@/lib/cms-schema";

export async function SimplePage({
  pageKey,
  title,
  description,
}: {
  pageKey: PageWritingType;
  title: string;
  description: string;
}) {
  const page = await getPageContent(pageKey);

  const resolvedTitle = page?.title ?? title;
  const resolvedDescription = page?.content_text ?? description;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <Badge>{resolvedTitle}</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">{resolvedTitle}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{resolvedDescription}</p>

      {page?.content_html && (
        <div
          className="prose prose-slate mt-6 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: page.content_html }}
        />
      )}

      {page?.image_url && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <Image
            src={page.image_url}
            alt={resolvedTitle}
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

