"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStandardPageContent } from "@/lib/cms-storage";
import type { StandardPageKey } from "@/lib/cms-schema";

export function SimplePage({
  pageKey,
  title,
  description,
}: {
  pageKey: StandardPageKey;
  title: string;
  description: string;
}) {
  const pageContent = useStandardPageContent(pageKey);
  const resolvedTitle = pageContent?.title ?? title;
  const resolvedDescription = pageContent?.description ?? description;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <Badge>{resolvedTitle}</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">{resolvedTitle}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{resolvedDescription}</p>
      {pageContent?.imageUrl && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <Image
            src={pageContent.imageUrl}
            alt={pageContent.imageName || resolvedTitle}
            width={1200}
            height={720}
            className="h-72 w-full object-cover"
          />
        </div>
      )}
      {pageContent?.button?.label && pageContent.button.href && (
        <div className="mt-6">
          <Button asChild>
            <Link href={pageContent.button.href}>{pageContent.button.label}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
