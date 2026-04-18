import type { Metadata } from "next";
import "./globals.css";

import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "勝利道潮語浸信會 | 木川共享空間",
  description: "勝利道潮語浸信會與木川共享空間官方網站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK" className="h-full antialiased">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <SiteNav />
        <main className="w-full flex-1">{children}</main>
        <footer className="mt-12 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-600 sm:px-6">
            © {new Date().getFullYear()} 勝利道潮語浸信會・木川共享空間
          </div>
        </footer>
      </body>
    </html>
  );
}
