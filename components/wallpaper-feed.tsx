import { getWallpapers } from "@/action/action-wallpapers";
import WallpaperGrid from "./wallpaper-grid";

export default async function WallpaperFeed({ category }: { category: string }) {
  const initialData = await getWallpapers(undefined, category);
  const initialWallpapers = initialData?.data?.wallpapers || [];
  const initialPagination = initialData?.data?.pagination || {
    currentPage: 1,
    totalPages: 1
  };

  return (
    <WallpaperGrid
      category={category}
      initialWallpapers={initialWallpapers}
      initialPagination={initialPagination}
    />
  );
}
