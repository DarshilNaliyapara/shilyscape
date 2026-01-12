import Header from "../components/header";
import WallpaperGrid from "../components/wallpaper-grid";
import { getWallpapers } from "@/action/get-wallpapers";
import WallpaperSkeleton from "../components/wallpaper-skeleton";
import { Suspense } from "react";
import { getCategories } from "@/utils/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const currentCategory = category || "All";
  const initialData = await getWallpapers(1, currentCategory);
  const initialWallpapers = initialData?.data?.wallpapers || [];
  const initialPagination = initialData?.data?.pagination || {
    currentPage: 1,
    totalPages: 1
  };
  let categories = await getCategories(process.env.BACKEND_API_URL || "");
  categories = ["all", ...categories];

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 p-4 md:p-4">
      <Header categories={categories} />

      <div className="h-20 md:h-32" />

      <Suspense key={currentCategory} fallback={<WallpaperSkeleton />}>
        <WallpaperGrid
          category={currentCategory}
          initialWallpapers={initialWallpapers}
          initialPagination={initialPagination}
        />
      </Suspense>
    </main>
  );
}