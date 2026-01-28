export default function WallpaperSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3 max-w-[1800px] mx-auto">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
          style={{ height: `${Math.floor(Math.random() * (400 - 200 + 1) + 200)}px` }}
        >
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
