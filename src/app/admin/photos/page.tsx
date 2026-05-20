import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getPhotos } from "@/lib/cms-storage";
import { PhotosAdminPanel } from "./photos-panel";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vasbc_admin_auth")?.value;
  if (!token) redirect("/admin/login");

  const photos = await getPhotos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">相片庫管理</h1>
      <PhotosAdminPanel initialPhotos={photos} />
    </div>
  );
}
