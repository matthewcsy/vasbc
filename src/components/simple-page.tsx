import { WritingDetail } from "@/components/writing-detail";
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
  return (
    <WritingDetail
      writing={page}
      defaultTitle={title}
      defaultDescription={description}
      badge={title}
    />
  );
}

