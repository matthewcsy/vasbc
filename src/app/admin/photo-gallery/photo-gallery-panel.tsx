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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PhotoGalleryRow, PhotoRow } from "@/lib/cms-schema";
import {
  addPhotoGalleryAction,
  addPhotoToGalleryAction,
  deletePhotoGalleryAction,
  removePhotoFromGalleryAction,
  saveGalleryOrderAction,
  updatePhotoGalleryAction,
} from "@/app/actions/cms";
// ─── Sortable gallery photo ───────────────────────────────────
function SortableGalleryPhoto({
  photo, onRemove, busy,
}: { photo: PhotoRow; onRemove: () => void; busy: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: photo.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="group relative cursor-grab overflow-hidden rounded-xl border border-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
      <button type="button" disabled={busy}
        className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow group-hover:flex"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}>
        ×
      </button>
    </div>
  );
}

// ─── Gallery editor ───────────────────────────────────────────
type GalleryWithPhotos = PhotoGalleryRow & { photos: PhotoRow[] };

function GalleryEditor({
  gallery, allPhotos, onDelete,
}: { gallery: GalleryWithPhotos; allPhotos: PhotoRow[]; onDelete: () => void }) {
  const [title, setTitle] = useState(gallery.title);
  const [photos, setPhotos] = useState<PhotoRow[]>(gallery.photos);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));
  const photoIdsInGallery = new Set(photos.map((p) => p.id));

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  async function handleSaveTitle() {
    setBusy(true);
    try { await updatePhotoGalleryAction(gallery.id, title); flash(); }
    finally { setBusy(false); }
  }

  async function handleDelete() {
    if (!confirm(`確定刪除相簿「${title}」？`)) return;
    setBusy(true);
    try { await deletePhotoGalleryAction(gallery.id); onDelete(); }
    finally { setBusy(false); }
  }

  async function handleAddPhoto(photo: PhotoRow) {
    setBusy(true);
    try {
      await addPhotoToGalleryAction(gallery.id, photo.id, photos.length + 1);
      setPhotos((prev) => [...prev, photo]);
    } finally { setBusy(false); }
  }

  async function handleRemovePhoto(photoId: number) {
    setBusy(true);
    try {
      await removePhotoFromGalleryAction(gallery.id, photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } finally { setBusy(false); }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = photos.findIndex((p) => p.id === active.id);
    const newIdx = photos.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(photos, oldIdx, newIdx);
    setPhotos(reordered);
    setBusy(true);
    try {
      await saveGalleryOrderAction(
        gallery.id,
        reordered.map((p) => p.id),
      );
    } finally { setBusy(false); }
  }

  const availablePhotos = allPhotos.filter((p) => !photoIdsInGallery.has(p.id));

  return (
    <Card className="space-y-4">
      {saved && <p className="rounded-lg bg-green-50 px-3 py-1.5 text-xs text-green-700">已儲存</p>}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label>相簿名稱</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <Button size="sm" disabled={busy} onClick={handleSaveTitle}>儲存名稱</Button>
        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" disabled={busy} onClick={handleDelete}>刪除相簿</Button>
      </div>

      {/* Photos in gallery (drag to reorder) */}
      {photos.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-slate-500">相簿內容（拖曳調整順序）</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {photos.map((photo) => (
                  <SortableGalleryPhoto
                    key={photo.id} photo={photo} busy={busy}
                    onRemove={() => void handleRemovePhoto(photo.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Add photo from library */}
      {availablePhotos.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-slate-500">從相片庫新增</p>
          <div className="flex flex-wrap gap-2">
            {availablePhotos.slice(0, 30).map((photo) => (
              <button key={photo.id} type="button" disabled={busy}
                className="overflow-hidden rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400"
                onClick={() => void handleAddPhoto(photo)}
                title="點擊加入相簿">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="h-12 w-12 object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Main panel ───────────────────────────────────────────────
type Props = {
  initialGalleries: (PhotoGalleryRow & { photos: PhotoRow[] })[];
  allPhotos: PhotoRow[];
};

export function PhotoGalleryPanel({ initialGalleries, allPhotos }: Props) {
  const [galleries, setGalleries] = useState<GalleryWithPhotos[]>(
    initialGalleries.map((g) => ({ ...g, photos: [] })),
  );
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddGallery() {
    if (!newTitle.trim()) return;
    setBusy(true); setError(null);
    try {
      const gallery = await addPhotoGalleryAction(newTitle.trim());
      setGalleries((prev) => [{ ...gallery, photos: [] }, ...prev]);
      setNewTitle("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {/* New gallery */}
      <div className="flex gap-3">
        <Input
          placeholder="新相簿名稱"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void handleAddGallery(); }}
        />
        <Button disabled={busy} onClick={handleAddGallery}>新增相簿</Button>
      </div>

      {galleries.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
          尚未建立相簿
        </p>
      )}

      {galleries.map((gallery) => (
        <GalleryEditor
          key={gallery.id}
          gallery={gallery}
          allPhotos={allPhotos}
          onDelete={() => setGalleries((prev) => prev.filter((g) => g.id !== gallery.id))}
        />
      ))}
    </div>
  );
}
