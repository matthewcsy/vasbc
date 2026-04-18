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

function isAdminSectionKey(section: string): section is AdminSectionKey {
  return (adminSectionKeys as readonly string[]).includes(section);
}

export default async function AdminSectionPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vasbc_admin_auth")?.value;
  if (!token) {
    redirect("/admin/login");
  }

  const { section } = await params;
  if (!isAdminSectionKey(section)) {
    notFound();
  }

  return <AdminDashboard activeSection={section} />;
}
