"use client"; 

import { useState, useEffect } from "react";
import StaggeredGrid from "./smart-layout";
import LoadMore from "./pagination";


interface PaginationData {
  totalPages: number;
  currentPage: number;
  totalDocs: number;
}

interface ApiResponse {
  success: boolean;
  data:{
      wallpapers: string[];
      pagination: PaginationData;
  }
}

interface WallpaperGridProps {
  category: string;
}

export default function WallpaperGrid({ category }: WallpaperGridProps) {
  // 2. Typed State
  const [wallpapers, setWallpapers] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

  // 3. Fetch Function
  const fetchWallpapers = async (pageNum: number, isNewCategory: boolean = false) => {
    if (loading) return;
    setLoading(true);

    const baseUrl = "https://wallpaper-carousel-production.up.railway.app/api/v1/wallpapers";
    
    // Logic to handle category
    const categoryParam = category && category !== "All" 
        ? `&category=${encodeURIComponent(category)}` 
        : "";
        
    const apiUrl = `${baseUrl}?page=${pageNum}${categoryParam}`;

    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const json: ApiResponse = await response.json(); // Type the response
        const newWallpapers = json.data.wallpapers || [];
        console.log(json)
        // Update Wallpapers List
        setWallpapers((prev) => {
          return isNewCategory || pageNum === 1 ? newWallpapers : [...prev, ...newWallpapers];
        });

        // Check pagination
        if (json.data.pagination.currentPage >= json.data.pagination.totalPages) {
          setHasMore(false);
        } else if (newWallpapers.length === 0) {
          setHasMore(false); 
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setWallpapers([]); 
    fetchWallpapers(1, true); 
  }, [category]); 

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWallpapers(nextPage, false);
  };

  if (initialLoadComplete && wallpapers.length === 0) {
    return (
      <div className="col-span-full w-full h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No Results Found</h3>
        <p className="text-gray-400 max-w-sm leading-relaxed">
          We couldn't find any wallpapers for <span className="text-cyan-400 font-medium">"{category}"</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
        <StaggeredGrid wallpapers={wallpapers} />

        {wallpapers.length > 0 && (
            <LoadMore 
                loading={loading} 
                hasMore={hasMore} 
                onLoadMore={handleLoadMore} 
            />
        )}
    </div>
  );
}