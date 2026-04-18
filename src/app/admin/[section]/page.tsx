import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import {
  AdminDashboard,
  adminSectionKeys,
  type AdminSectionKey,
} from "@/components/admin/admin-dashboard";

type Props = {
  params: Promise<{ section: string }>;
};

export default async function AdminSectionPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vasbc_admin_auth")?.value;
  if (!token) {
    redirect("/admin/login");
  }

  const { section } = await params;
  if (!adminSectionKeys.includes(section as AdminSectionKey)) {
    notFound();
  }

  return <AdminDashboard activeSection={section as AdminSectionKey} />;
}
