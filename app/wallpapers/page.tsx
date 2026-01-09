import { Suspense } from "react";
import Header from "../components/header";
import WallpaperGrid from "../components/wallpaper-grid";
import WallpaperSkeleton from "../components/wallpaper-skeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const currentCategory = category || "All";

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 p-4 md:p-4">
      <Header />
      
      <div className="h-20 md:h-32" />

      <Suspense key={currentCategory} fallback={<WallpaperSkeleton />}>
        <WallpaperGrid category={currentCategory} />
      </Suspense>
    </main>
  );
}