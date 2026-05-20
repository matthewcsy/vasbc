"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { AssemblyRow, NewsRow, PhotoGalleryRow, PhotoRow, WritingRow } from "@/lib/cms-schema";
import {
  restoreArticleAction,
  restoreMissionaryAction,
  restoreNewsAction,
  restorePhotoAction,
  restorePhotoGalleryAction,
  restoreSermonAction,
} from "@/app/actions/cms";

type DeletedItems = {
  news: NewsRow[];
  assembly: AssemblyRow[];
  writings: WritingRow[];
  photos: PhotoRow[];
  galleries: PhotoGalleryRow[];
};

type Props = { initialDeleted: DeletedItems };

export function RecoverPanel({ initialDeleted }: Props) {
  const [deleted, setDeleted] = useState(initialDeleted);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  function flash(msg: string) {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2000);
  }

  async function restore(
    table: keyof DeletedItems,
    id: number,
    action: (id: number) => Promise<void>,
    label: string,
  ) {
    setBusy(true);
    try {
      await action(id);
      setDeleted((prev) => ({
        ...prev,
        [table]: (prev[table] as Array<{ id: number }>).filter((item) => item.id !== id),
      }));
      flash(`已還原「${label}」`);
    } finally {
      setBusy(false);
    }
  }

  const isEmpty =
    deleted.news.length === 0 &&
    deleted.assembly.length === 0 &&
    deleted.writings.length === 0 &&
    deleted.photos.length === 0 &&
    deleted.galleries.length === 0;

  return (
    <div className="space-y-6">
      {saved && <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{saved}</p>}
      {isEmpty && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
          回收站為空
        </p>
      )}

      {deleted.news.length > 0 && (
        <Section title={`最新消息（${deleted.news.length}）`}>
          {deleted.news.map((item) => (
            <Row
              key={item.id}
              label={item.title}
              sub={item.published_at ?? undefined}
              onRestore={() => void restore("news", item.id, restoreNewsAction, item.title)}
              busy={busy}
            />
          ))}
        </Section>
      )}

      {deleted.assembly.length > 0 && (
        <Section title={`講道（${deleted.assembly.length}）`}>
          {deleted.assembly.map((item) => (
            <Row
              key={item.id}
              label={item.topic ?? "（無標題）"}
              sub={item.speaker ?? undefined}
              onRestore={() => void restore("assembly", item.id, restoreSermonAction, item.topic ?? String(item.id))}
              busy={busy}
            />
          ))}
        </Section>
      )}

      {deleted.writings.filter((w) => w.type === "article").length > 0 && (
        <Section title={`文章（${deleted.writings.filter((w) => w.type === "article").length}）`}>
          {deleted.writings
            .filter((w) => w.type === "article")
            .map((item) => (
              <Row
                key={item.id}
                label={item.title}
                sub={item.date_iso ?? undefined}
                onRestore={() => void restore("writings", item.id, restoreArticleAction, item.title)}
                busy={busy}
              />
            ))}
        </Section>
      )}

      {deleted.writings.filter((w) => w.type === "missionary").length > 0 && (
        <Section title={`宣教報導（${deleted.writings.filter((w) => w.type === "missionary").length}）`}>
          {deleted.writings
            .filter((w) => w.type === "missionary")
            .map((item) => (
              <Row
                key={item.id}
                label={item.title}
                sub={item.date_iso ?? undefined}
                onRestore={() => void restore("writings", item.id, restoreMissionaryAction, item.title)}
                busy={busy}
              />
            ))}
        </Section>
      )}

      {deleted.photos.length > 0 && (
        <Section title={`相片（${deleted.photos.length}）`}>
          {deleted.photos.map((item) => (
            <Row
              key={item.id}
              label={item.filename}
              onRestore={() => void restore("photos", item.id, restorePhotoAction, item.filename)}
              busy={busy}
            />
          ))}
        </Section>
      )}

      {deleted.galleries.length > 0 && (
        <Section title={`相簿（${deleted.galleries.length}）`}>
          {deleted.galleries.map((item) => (
            <Row
              key={item.id}
              label={item.title}
              onRestore={() => void restore("galleries", item.id, restorePhotoGalleryAction, item.title)}
              busy={busy}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-medium text-slate-700">{title}</p>
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function Row({
  label, sub, onRestore, busy,
}: { label: string; sub?: string; onRestore: () => void; busy: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">{label}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
      <Button size="sm" disabled={busy} onClick={onRestore}>還原</Button>
    </div>
  );
}
