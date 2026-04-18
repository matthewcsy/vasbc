import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

async function login(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSCODE ?? "vasbc-admin";

  if (password !== expected) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("vasbc_admin_auth", "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10 sm:px-6">
      <Card className="w-full">
        <CardTitle>Admin 登入</CardTitle>
        <CardDescription>請輸入管理密碼以進入 /admin 後台。</CardDescription>
        <form action={login} className="mt-4 space-y-3">
          <Input name="password" type="password" placeholder="管理密碼" required />
          {error && <p className="text-sm text-rose-600">密碼不正確，請再試一次。</p>}
          <Button type="submit" className="w-full">
            登入
          </Button>
        </form>
      </Card>
    </div>
  );
}
