import { getWallpapers } from "@/action/action-wallpapers";
import WallpaperGrid from "@/components/wallpaper-grid";

export async function SearchResults({ query }: { query: string }) {
  const initialData = await getWallpapers(undefined, undefined, query);
  const wallpapers = initialData?.data?.wallpapers || [];
  const pagination = initialData?.data?.pagination || { currentPage: 1, totalPages: 1, totalDocs: 0 };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <WallpaperGrid 
        initialWallpapers={wallpapers}
        initialPagination={pagination}
        query={query}
      />
    </div>
  );
}