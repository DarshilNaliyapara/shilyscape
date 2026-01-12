'use server'

export async function getWallpapers(page: number, category: string) {
  const baseUrl = "https://wallpaper-carousel-production.up.railway.app/api/v1/wallpapers";
  const categoryParam = category && category !== "All" ? `&category=${encodeURIComponent(category)}` : "";
  const apiUrl = `${baseUrl}?page=${page}${categoryParam}`;

  const res = await fetch(apiUrl, {
    cache: 'force-cache',
    next: { revalidate: 300 } 
  });

  if (!res.ok) throw new Error('Failed to fetch');
  
  return res.json();
}