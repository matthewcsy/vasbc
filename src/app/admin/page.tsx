import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vasbc_admin_auth")?.value;
  if (!token) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
