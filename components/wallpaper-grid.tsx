"use client";

import { useState, useEffect } from "react";
import StaggeredGrid from "@/components/smart-layout";
import LoadMore from "@/components/load-more";
import { getWallpapers } from "@/action/action-wallpapers";

interface Wallpaper {
    id: number,
    imgLink: string;
    tags: string[];
}

interface Pagination {
    nextCursor: string,
    hasMore: boolean
}

interface WallpaperGridProps {
    initialWallpapers: Wallpaper[];
    initialPagination: Pagination;
    category?: string;
    query?: string;
}

export default function WallpaperGrid({
    initialWallpapers,
    initialPagination,
    category,
    query
}: WallpaperGridProps) {

    const [wallpapers, setWallpapers] = useState<Wallpaper[]>(initialWallpapers);
    const [cursor, setCursor] = useState<string | undefined | null>(initialPagination.nextCursor);
    const [hasMore, setHasMore] = useState<boolean>(initialPagination.hasMore);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setWallpapers(initialWallpapers);
        setCursor(initialPagination.nextCursor);
        setHasMore(initialPagination.hasMore);
        setLoading(false);
    }, [category, query, initialWallpapers, initialPagination]);

    const handleLoadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const categoryParam = query ? undefined : category;

            const res = await getWallpapers(cursor ?? undefined, categoryParam, query);
            console.log("wallpaper", res)
            if (res?.data?.wallpapers && res.data.wallpapers.length > 0) {
                const newWallpapers = res.data.wallpapers;
                const pagination = res.data.pagination;
                setWallpapers((prev) => {
                    const existingIds = new Set(prev.map(w => w.id));
                    const uniqueNew = newWallpapers.filter((w: any) => !existingIds.has(w.id));
                    return [...prev, ...uniqueNew];
                });

                setCursor(pagination.nextCursor);
                setHasMore(pagination.hasMore);

            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more:", error);
        } finally {
            setLoading(false);
        }
    };
    if (wallpapers.length === 0) {
        const isSearch = !!query;

        return (
            <div className={isSearch ? "w-full" : "max-w-[1800px] mx-auto"}>
                <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-3xl bg-neutral-900/50">

                    <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
                        {isSearch ? (
                            <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {isSearch ? "No matches found" : "Collection Empty"}
                    </h3>

                    {/* Description Text */}
                    <p className="text-gray-500 text-center max-w-sm px-4 leading-relaxed">
                        {isSearch ? (
                            <>
                                We couldn't find any wallpapers matching <span className="text-cyan-400">"{query}"</span>. Try checking for typos or use a different keyword.
                            </>
                        ) : (
                            <>
                                The <span className="text-cyan-400">"{category}"</span> category doesn't have any wallpapers yet. Check back soon for fresh drops!
                            </>
                        )}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full pb-10">
            <StaggeredGrid wallpapers={wallpapers} />

            <LoadMore
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
            />
        </div>
    );
}
