import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  AnnouncementEditForm,
  SermonEditForm,
  ArticleEditForm,
  MissionaryEditForm,
} from "@/components/admin/item-edit-forms";
import { getAssemblyById, getNewsById, getWritingById } from "@/lib/cms-storage";

type Props = {
  params: Promise<{ section: string; id: string }>;
};

const sectionTitles: Record<string, string> = {
  announcements: "編輯消息",
  sermons: "編輯講道",
  articles: "編輯文章",
  missionary: "編輯宣教報導",
};

export default async function AdminItemEditPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vasbc_admin_auth")?.value;
  if (!token) redirect("/admin/login");

  const { section, id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const title = sectionTitles[section];
  if (!title) notFound();

  if (section === "announcements") {
    const item = await getNewsById(numId);
    if (!item) notFound();
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BackLink section={section} />
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">{title}</h1>
        <AnnouncementEditForm item={item} />
      </div>
    );
  }

  if (section === "sermons") {
    const item = await getAssemblyById(numId);
    if (!item) notFound();
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BackLink section={section} />
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">{title}</h1>
        <SermonEditForm item={item} />
      </div>
    );
  }

  if (section === "articles") {
    const item = await getWritingById(numId);
    if (!item) notFound();
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BackLink section={section} />
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">{title}</h1>
        <ArticleEditForm item={item} />
      </div>
    );
  }

  if (section === "missionary") {
    const item = await getWritingById(numId);
    if (!item) notFound();
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BackLink section={section} />
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">{title}</h1>
        <MissionaryEditForm item={item} />
      </div>
    );
  }

  notFound();
}

function BackLink({ section }: { section: string }) {
  return (
    <Link
      href={`/admin/${section}`}
      className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
    >
      ← 返回列表
    </Link>
  );
}
