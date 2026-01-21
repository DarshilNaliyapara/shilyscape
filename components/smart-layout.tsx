import { getWallpaperName, getOptimizedUrl } from "@/utils/utils";

interface Wallpaper {
  imgLink: string;
  tags: string[];
}

export default function StaggeredGrid({ wallpapers }: { wallpapers: Wallpaper[] }) {
  return (
    <div className="max-w-[1800px] mx-auto md:px-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3 max-w-[1800px] mx-auto">

        {wallpapers.map((wallpaper, index) => {
          const name = getWallpaperName(wallpaper.imgLink);
          const src = getOptimizedUrl(wallpaper.imgLink, 600);

          const hasTags = wallpaper.tags && wallpaper.tags.length > 0;

          return (
            <div
              key={`${wallpaper.imgLink}-${index}`}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
            >
              <img
                src={src}
                alt={name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
              />
              {hasTags &&
                <div className="absolute inset-x-3 bottom-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 translate-y-0 opacity-100 md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-white tracking-wider truncate pr-2">
                      {wallpaper.tags.map(tag => `#${tag}`).join("  ")}
                    </h2>
                  </div>
                </div>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
