import Link from "next/link";
import Terminal from "../components/terminal";
import { getWallpaperName, getOptimizedUrl } from "@/utils/utils";
import Navbar from "../components/navbar";
import { getWallpapers } from "@/action/action-wallpapers";
import MobileSearch from "../components/mobile-searchbar";

export default async function Home() {
  const res = await getWallpapers()
  const wallpapers = res.data.wallpapers;

  const installCommand = `curl -sL https://raw.githubusercontent.com/DarshilNaliyapara/wallpaper-carousel-script/main/wallpaperfetch | sh`;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">

      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-20">
        <Navbar />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="z-10 text-center space-y-8 px-4 max-w-4xl mx-auto w-full">

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              ShilyScape
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto">
              Automate your desktop background with our CLI tool.
            </p>
          </div>

          <div className="text-left w-full">
            <Terminal command={installCommand} />
            <p className="text-center text-xs text-gray-600 mt-3 font-mono">
              Copy and paste into your terminal
            </p>
          </div>

          <div className="pt-8">
            <a
              href="#recent_uploads"
              className="group flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-all duration-200 mx-auto w-fit shadow-lg shadow-white/5"
            >
              <span>See Recent Uploads</span>
              <svg
                className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section id="recent_uploads" className="py-12 px-4 md:px-12 max-w-[1800px] mx-auto bg-neutral-950/50">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div className="flex items-start gap-4">
            <span className="text-6xl font-black text-white/40 -mt-4 select-none">01</span>
            <div>
              <h2 className="text-2xl font-bold text-white leading-none mb-2">
                Fresh Drops
              </h2>
              <p className="text-sm text-gray-500 max-w-xs">
                Curated high-resolution wallpapers added to the collection today.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[280px]">
          {wallpapers.slice(0, 4).map((url: string, index: number) => {
            const name = getWallpaperName(url);
            const optimizedSrc = getOptimizedUrl(url, 800);
            const isBig = index % 10 === 0;
            const isWide = index % 5 === 1 && !isBig;

            return (
              <div
                key={`${url}-${index}`}
                className={`
                  relative group overflow-hidden rounded-xl bg-neutral-900
                  ${isBig ? "md:col-span-2 md:row-span-2" : ""}
                  ${isWide ? "md:col-span-2" : ""}
                `}
              >
                <img
                  src={optimizedSrc}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-105"
                />

                <div className="absolute inset-x-3 bottom-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider truncate pr-2">{name}</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/wallpapers"
            className="group relative px-8 py-4 bg-[#111] border border-white/20 rounded-full overflow-hidden hover:border-cyan-500 transition-colors"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-3 font-bold text-gray-300 group-hover:text-white">
              View Full Collection
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      <MobileSearch />
    </main>
  );
}
