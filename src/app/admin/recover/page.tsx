import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDeletedItems } from "@/lib/cms-storage";
import { RecoverPanel } from "./recover-panel";

export const dynamic = "force-dynamic";

export default async function AdminRecoverPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vasbc_admin_auth")?.value;
  if (!token) redirect("/admin/login");

  const deleted = await getDeletedItems();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">回收站</h1>
      <RecoverPanel initialDeleted={deleted} />
    </div>
  );
}
