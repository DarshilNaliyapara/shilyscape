import { getWallpapers } from "@/action/action-wallpapers";
import WallpaperGrid from "@/components/wallpaper-grid";

export async function SearchResults({ query }: { query: string }) {
  const initialData = await getWallpapers(1, undefined, query);
  const wallpapers = initialData?.data?.wallpapers || [];
  const pagination = initialData?.data?.pagination || { currentPage: 1, totalPages: 1, totalDocs: 0 };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500  px-4 md:px-0">
      <div className="mb-4 flex items-center justify-between px-8">
         <span className="text-gray-500 font-mono text-sm">
            {pagination.totalDocs} {pagination.totalDocs === 1 ? "Result" : "Results"} Found
         </span>
      </div>

      <WallpaperGrid 
        initialWallpapers={wallpapers}
        initialPagination={pagination}
        query={query}
      />
    </div>
  );
}