import { HomeContent } from "@/components/home-content";
import { getAssembly, getNews } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [news, sermons] = await Promise.all([getNews(), getAssembly()]);

  return (
    <HomeContent
      featuredNews={news.slice(0, 3)}
      featuredSermons={sermons.slice(0, 3)}
    />
  );
}

