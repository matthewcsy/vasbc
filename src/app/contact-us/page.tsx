import Image from "next/image";

import { ContactForm } from "./contact-form";
import { Badge } from "@/components/ui/badge";
import { getPageContent } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

export default async function ContactUsPage() {
  const page = await getPageContent("contact-us");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <Badge>{page?.title ?? "聯絡我們"}</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-[#2D2421]">
        {page?.title ?? "聯絡我們"}
      </h1>
      <p className="mt-3 max-w-3xl text-[#4A3B32]">
        {page?.content_text ?? "提供地址、電話、電郵與地圖，歡迎隨時聯絡我們。"}
      </p>

      {page?.content_html && (
        <div
          className="prose prose-stone mt-6 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: page.content_html }}
        />
      )}

      {page?.image_url && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#E8E1D3]">
          <Image
            src={page.image_url}
            alt="聯絡我們"
            width={1200}
            height={720}
            className="h-72 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-[#E8E1D3] bg-[#FAF8F5] p-6 md:p-8">
        <h2 className="mb-6 text-xl font-semibold text-[#2D2421]">發送留言</h2>
        <ContactForm />
      </div>
    </div>
  );
}
