import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function MangroveSpacePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <section className="grid gap-6 rounded-3xl bg-[#f8f5ef] p-6 shadow-sm lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Badge className="bg-[#e8dcc7] text-[#775b32]">木川共享空間</Badge>
          <h1 className="mt-4 text-3xl font-semibold text-[#3a2a16]">
            Mangrove Space
          </h1>
          <p className="mt-3 text-[#5c4830]">
            以咖啡館與共享工作空間為靈感，打造明亮、開放、包容的社區場域。
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80"
            alt="Mangrove Space interior"
            width={1200}
            height={800}
            className="h-64 w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white">
          <CardTitle>IG/FB Social Feed</CardTitle>
          <CardDescription>
            社交媒體整合預留區塊（Instagram / Facebook）
          </CardDescription>
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            IG/FB Feed Placeholder
          </div>
        </Card>

        <Card className="bg-white">
          <CardTitle>合辦活動重點</CardTitle>
          <CardDescription>兒童牧區與木川合辦活動</CardDescription>
          <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            本月重點：兒童牧區與木川共享空間將於週六舉行「親子故事日＋創意手作工作坊」。
          </div>
        </Card>
      </section>
    </div>
  );
}
