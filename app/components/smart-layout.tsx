import { getWallpaperName, getRandomCropUrl } from "@/utils/utils";
// 1. Updated SHAPES: Only Desktop Friendly (Wide & Square)

export default function StaggeredGrid({ wallpapers }: { wallpapers: string[] }) {
  return (
    <div className="max-w-[1800px] mx-auto pt-2 px-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 max-w-[1800px] mx-auto">
        
        {wallpapers.map((url, index) => {
          const name = getWallpaperName(url);
          const { src, heightClass } = getRandomCropUrl(url, index, 600);

          return (
            <div
              key={`${url}-${index}`}
              className={`
                break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 
                ${heightClass} /* Forces the aspect ratio via Tailwind */
              `}
            >
              <img
                src={src}
                alt={name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-x-3 bottom-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider truncate pr-2">{name}</h2>
                  </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}