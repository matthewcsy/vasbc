import { SimplePage } from "@/components/simple-page";

export const dynamic = "force-dynamic";

export default function ContactUsPage() {
  return (
    <SimplePage
      pageKey="contact-us"
      title="\u806f\u7d61\u6211\u5011"
      description="\u63d0\u4f9b\u5730\u5740\u3001\u96fb\u8a71\u3001\u96fb\u90f5\u8207\u5730\u5716\uff0c\u6b61\u8fce\u96a8\u6642\u806f\u7d61\u6211\u5011\u3002"
    />
  );
}

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
