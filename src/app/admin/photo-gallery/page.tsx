import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getGalleryPhotos, getPhotoGalleries, getPhotos } from "@/lib/cms-storage";
import { PhotoGalleryPanel } from "./photo-gallery-panel";

export const dynamic = "force-dynamic";

export default async function AdminPhotoGalleryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vasbc_admin_auth")?.value;
  if (!token) redirect("/admin/login");

  const [galleries, allPhotos] = await Promise.all([
    getPhotoGalleries(),
    getPhotos(),
  ]);

  // Pre-fetch photos for each gallery
  const galleriesWithPhotos = await Promise.all(
    galleries.map(async (g) => {
      const items = await getGalleryPhotos(g.id);
      return { ...g, photos: items.map((i) => i.photo) };
    }),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">相簿管理</h1>
      <PhotoGalleryPanel initialGalleries={galleriesWithPhotos} allPhotos={allPhotos} />
    </div>
  );
}
