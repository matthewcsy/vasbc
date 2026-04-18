"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useCmsData } from "@/lib/cms-storage";

export default function AnnouncementsPage() {
  const {
    data: { announcements },
  } = useCmsData();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <Badge>最新消息</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">最新消息</h1>
        <p className="mt-2 text-slate-600">完整消息列表。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((item) => (
          <Card key={item.id} className="overflow-hidden p-0">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={1000}
                height={700}
                className="h-44 w-full object-cover"
              />
            )}
            <div className="p-4">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.date}</CardDescription>
              <p className="mt-2 text-sm text-slate-700">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
