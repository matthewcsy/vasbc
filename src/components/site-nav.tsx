"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

const aboutItems = [
  { label: "教會信仰", href: "/about/beliefs" },
  { label: "教會簡史", href: "/about/history" },
  { label: "教會約章", href: "/about/covenant" },
  { label: "執事名錄", href: "/about/deacons" },
  { label: "同工名錄", href: "/about/staff" },
];

const navItems = [
  { label: "主頁", href: "/" },
  { label: "木川共享空間", href: "/mangrove-space", highlight: true },
  { label: "最新消息", href: "/announcements" },
  { label: "聚會時間", href: "/gathering-times" },
  { label: "講道／專題", href: "/sermons-topics" },
  { label: "宣教工場", href: "/missions" },
  { label: "文章分享", href: "/articles" },
  { label: "招聘", href: "/recruitment" },
  { label: "聯絡我們", href: "/contact-us" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E1D3]/80 bg-[#FDFBF7]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-wide text-[#2D2421]">
          勝利道潮語浸信會
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium text-[#4A3B32] transition hover:text-[#D06B4A]",
              pathname === "/" && "text-[#D06B4A]",
            )}
          >
            主頁
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1 text-sm font-medium text-[#4A3B32] transition hover:text-[#D06B4A]">
              認識教會 <ChevronDown className="h-4 w-4" />
            </button>
            <div className="invisible absolute left-0 top-8 w-40 rounded-xl border border-[#E8E1D3] bg-[#FDFBF7] p-2 opacity-0 shadow-md transition group-hover:visible group-hover:opacity-100">
              {aboutItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm text-[#4A3B32] transition hover:bg-[#F0EBE1] hover:text-[#D06B4A]",
                    pathname === item.href && "bg-[#F0EBE1] text-[#D06B4A]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-2 py-1 text-sm font-medium text-[#4A3B32] transition hover:text-[#D06B4A]",
                item.highlight && "bg-[#EAECE7] text-[#314F40]",
                pathname === item.href && "text-[#D06B4A]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="inline-flex rounded-lg p-2 text-[#4A3B32] lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="開啟選單"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#E8E1D3] bg-[#FDFBF7] px-4 py-3 lg:hidden">
          <div className="grid gap-1">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-[#4A3B32]"
              onClick={() => setMobileOpen(false)}
            >
              主頁
            </Link>
            <p className="px-3 pt-2 text-xs font-semibold text-[#6B5C52]">認識教會</p>
            {aboutItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-[#4A3B32]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-[#4A3B32]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
