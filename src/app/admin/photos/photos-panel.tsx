"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { PhotoRow } from "@/lib/cms-schema";
import {
  deletePhotoAction,
  saveCarouselOrderAction,
  togglePhotoCarouselAction,
  uploadPhotoAction,
} from "@/app/actions/cms";

// ─── Sortable carousel thumbnail ─────────────────────────────
function SortableThumb({ photo, index }: { photo: PhotoRow; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: photo.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex-shrink-0 cursor-grab"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt=""
        className="h-16 w-28 rounded-lg object-cover"
      />
      <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] font-bold text-white">
        {index + 1}
      </span>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────
type Props = { initialPhotos: PhotoRow[] };

export function PhotosAdminPanel({ initialPhotos }: Props) {
  const [photos, setPhotos] = useState<PhotoRow[]>(initialPhotos);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const carouselPhotos = photos
    .filter((p) => p.in_hero_carousel)
    .sort((a, b) => (a.hero_order ?? 999) - (b.hero_order ?? 999));

  const sensors = useSensors(useSensor(PointerSensor));

  function flash(msg: string) {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2000);
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true); setError(null);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      // Get dimensions via Image element
      const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = URL.createObjectURL(file);
      });
      const fd = new FormData();
      fd.append("file", file);
      if (width) fd.append("width", String(width));
      if (height) fd.append("height", String(height));
      const photo = await uploadPhotoAction(fd);
      if (photo) setPhotos((prev) => [photo, ...prev]);
    }
    setBusy(false);
    flash("上傳完成");
  }

  async function handleDelete(id: number) {
    if (!confirm("確定刪除此相片（移至回收站）？")) return;
    setBusy(true);
    try {
      await deletePhotoAction(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleCarousel(photo: PhotoRow) {
    const next = !photo.in_hero_carousel;
    setBusy(true);
    try {
      await togglePhotoCarouselAction(photo.id, next);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? { ...p, in_hero_carousel: next, hero_order: next ? 9999 : null }
            : p,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  function handleCarouselDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = carouselPhotos.findIndex((p) => p.id === active.id);
    const newIndex = carouselPhotos.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(carouselPhotos, oldIndex, newIndex);
    // Update local state with new order
    const orderMap = new Map(reordered.map((p, i) => [p.id, i + 1]));
    setPhotos((prev) =>
      prev.map((p) =>
        orderMap.has(p.id) ? { ...p, hero_order: orderMap.get(p.id) ?? null } : p,
      ),
    );
  }

  async function handleSaveCarouselOrder() {
    setBusy(true);
    try {
      await saveCarouselOrderAction(carouselPhotos.map((p) => p.id));
      flash("輪播順序已儲存");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{saved}</p>}

      {/* Upload zone */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-600">上傳相片</h2>
        <div
          className={`flex min-h-[120px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed text-sm transition-colors ${dragOver ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-300 bg-slate-50 text-slate-400"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false);
            void handleFileUpload(e.dataTransfer.files);
          }}
          onClick={() => document.getElementById("photo-upload-input")?.click()}
        >
          {busy ? "上傳中…" : "拖放圖片至此，或點擊選擇（可多選）"}
        </div>
        <input
          id="photo-upload-input" type="file" multiple accept="image/*" className="hidden"
          onChange={(e) => void handleFileUpload(e.target.files)}
        />
      </section>

      {/* Photo grid */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-600">
          相片庫（{photos.length} 張）<span className="ml-2 font-normal text-slate-400">金框 = 16:9 寬屏 · 綠框 = 已加入輪播 · 點擊圖片切換輪播</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                photo.in_hero_carousel
                  ? "border-green-500 shadow-md shadow-green-200"
                  : photo.is_widescreen
                    ? "border-amber-400"
                    : "border-transparent"
              }`}
              onClick={() => void handleToggleCarousel(photo)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt=""
                className="aspect-square w-full object-cover"
              />
              {/* Delete button */}
              <button
                type="button"
                className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow group-hover:flex"
                onClick={(e) => { e.stopPropagation(); void handleDelete(photo.id); }}
                disabled={busy}
              >
                ×
              </button>
              {photo.in_hero_carousel && (
                <span className="absolute bottom-1 left-1 rounded-full bg-green-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  輪播
                </span>
              )}
              {photo.is_widescreen && !photo.in_hero_carousel && (
                <span className="absolute bottom-1 left-1 rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  16:9
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Carousel reorder */}
      {carouselPhotos.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-600">
              輪播順序（{carouselPhotos.length} 張）— 拖曳調整
            </h2>
            <Button size="sm" disabled={busy} onClick={handleSaveCarouselOrder}>
              儲存順序
            </Button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCarouselDragEnd}
          >
            <SortableContext
              items={carouselPhotos.map((p) => p.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-3 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {carouselPhotos.map((photo, i) => (
                  <SortableThumb key={photo.id} photo={photo} index={i} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      )}
    </div>
  );
}
