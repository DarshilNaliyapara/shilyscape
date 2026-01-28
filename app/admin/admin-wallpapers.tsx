import { getWallpapers } from "@/action/action-wallpapers";
import LoadMore from "@/components/load-more";
import WallpaperSkeleton from "@/components/wallpaper-skeleton";
import { Edit3 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";


interface RawWallpaper {
    id: string;
    name?: string;
    category?: string;
    tags?: string[];
    imgLink: string;
}

interface AdminWallpaperProps {
    onEdit: (wallpaper: RawWallpaper) => void;
    query: string;
}

export const AdminWallpaper = ({ onEdit, query }: AdminWallpaperProps) => {
    const [wallpapers, setWallpapers] = useState<RawWallpaper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const formatWallpapers = (rawList: any[]): RawWallpaper[] => {
        return rawList.map((wp) => ({
            id: wp.id,
            name: wp.name || "UnNamed",
            category: wp.category || "Uncategorized",
            tags: wp.tags || [],
            imgLink: wp.imgLink,
        }));
    };

    const fetchInitialData = useCallback(async (searchQuery: string) => {
        setIsLoading(true);
        try {
            const response = await getWallpapers(1, undefined, searchQuery);
            const rawData = response?.data?.wallpapers || [];
            const pagination = response?.data?.pagination;

            setWallpapers(formatWallpapers(rawData));
            setPage(1);
            if (pagination) {
                setHasMore(pagination.currentPage < pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch wallpapers", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInitialData(query || "");
        }, 500);
        return () => clearTimeout(timer);
    }, [query, fetchInitialData]);


    const handleLoadMore = async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        const nextPage = page + 1;

        try {
            const res = await getWallpapers(nextPage, undefined, query);

            if (res?.data?.wallpapers) {
                const newWallpapers = formatWallpapers(res.data.wallpapers);
                const pagination = res.data.pagination;

                setWallpapers((prev) => [...prev, ...newWallpapers]);
                setPage(nextPage);

                if (pagination) {
                    setHasMore(pagination.currentPage < pagination.totalPages);
                } else {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        isLoading ? (
            <WallpaperSkeleton />
        ) : (
            <div className="max-w-[1800px] mx-auto">
                {wallpapers.length == 0 && query ?
                    (
                        <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-3xl bg-neutral-900/50">
                            <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
                                <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                "No matches found"
                            </h3>
                            <p className="text-gray-500 text-center max-w-sm px-4 leading-relaxed">
                                We couldn't find any wallpapers matching <span className="text-cyan-400">"{query}"</span>. Try checking for typos or use a different keyword.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                                {wallpapers.map((wallpaper: RawWallpaper) => {
                                    return (
                                        <div key={wallpaper.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-sm hover:shadow-2xl hover:shadow-cyan-900/10 hover:border-neutral-700 transition-all duration-300">
                                            <img src={wallpaper.imgLink} alt={wallpaper.name} loading="lazy" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <h3 className="text-white font-bold truncate">{wallpaper.name}</h3>
                                                    <p className="text-neutral-300 text-xs mb-4">{wallpaper.category}</p>
                                                    <button onClick={() => onEdit(wallpaper)} className="w-full bg-white/10 backdrop-blur-xl hover:bg-white text-white hover:text-black border border-white/20 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200">
                                                        <Edit3 size={16} /> Edit Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <LoadMore
                                loading={isLoadingMore}
                                hasMore={hasMore}
                                onLoadMore={handleLoadMore}
                            />
                        </>
                    )}
            </div>
        )
    )
}