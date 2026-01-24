import { Suspense } from "react";
import Header from "../../components/header";
import WallpaperSkeleton from "../../components/wallpaper-skeleton";
import WallpaperFeed from "../../components/wallpaper-feed";
import { getCategories } from "@/action/get-categories";
import MobileSearch from "../../components/mobile-searchbar";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const currentCategory = category || "All";
  let categories = await getCategories();
  categories = ["all", ...categories];

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 p-4 md:p-4">
      <Header categories={categories} />

      <div className="h-20 md:h-32" />

      <Suspense key={currentCategory} fallback={<WallpaperSkeleton />}>
        <WallpaperFeed category={currentCategory} />
      </Suspense>

      <MobileSearch />
    </main>
  );
}
