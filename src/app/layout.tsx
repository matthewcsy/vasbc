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
      <body className="flex min-h-screen flex-col bg-[#F9F6F0] text-[#3A2E2A]">
        <SiteNav />
        <main className="w-full flex-1">{children}</main>
        <footer className="mt-12 border-t border-[#E8E1D3] bg-[#2D2421]">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-[#C8C0B1] sm:px-6">
            © {new Date().getFullYear()} 勝利道潮語浸信會・木川共享空間
          </div>
        </footer>
      </body>
    </html>
  );
}
