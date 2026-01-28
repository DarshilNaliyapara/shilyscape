import { Suspense } from "react";
import Navbar from "@/components/navbar";
import MobileSearch from "@/components/mobile-searchbar";
import WallpaperSkeleton from "@/components/wallpaper-skeleton";
import { SearchResults } from "@/components/search-feed";


interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage(props: SearchPageProps) {
    const searchParams = await props.searchParams;
    const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 p-4 md:p-4">
            <Navbar />

            <section className="pt-24 md:px-8 max-w-[1800px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                            {q ? (
                                <>Results for <span className="text-cyan-400">"{q}"</span></>
                            ) : (
                                "Search"
                            )}
                        </h1>
                    </div>
                    {/* Note: Result count moved inside SearchResults component */}
                </div>
            </section>

            {/* Content Logic */}
            {!q ? (
                <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-3xl bg-neutral-900/30">
                    <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Search for Wallpapers</h2>
                    <p className="text-gray-500 max-w-sm">
                        Type in the search bar above to find wallpapers by name, category, or tags.
                    </p>
                </div>
            ) : (
                <div className="md:px-8">
                    <Suspense key={q} fallback={<WallpaperSkeleton />}>
                        <SearchResults query={q} />
                    </Suspense>
                </div>
            )}

            <MobileSearch />
        </main>
    );
}