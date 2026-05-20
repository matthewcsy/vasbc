import { notFound } from "next/navigation";

import { WritingDetail } from "@/components/writing-detail";
import { getWritingById } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

export default async function MissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const report = await getWritingById(numericId);
  if (!report || report.type !== "missionary") notFound();

  return (
    <WritingDetail
      writing={report}
      defaultTitle={report.title}
      badge="宣教工場"
      backHref="/missions"
      backLabel="返回宣教工場"
    />
  );
}
