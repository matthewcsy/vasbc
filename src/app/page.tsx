import { HomeContent } from "@/components/home-content";
import { getAssembly, getNews, getHeroCarouselPhotos } from "@/lib/cms-storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [news, sermons, carouselPhotos] = await Promise.all([
    getNews(),
    getAssembly(),
    getHeroCarouselPhotos(),
  ]);

  return (
    <HomeContent
      featuredNews={news.slice(0, 3)}
      featuredSermons={sermons.slice(0, 3)}
      carouselPhotos={carouselPhotos.map((p) => ({ id: p.id, url: p.url }))}
    />
  );
}

