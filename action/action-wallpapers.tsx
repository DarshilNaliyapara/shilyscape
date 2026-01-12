'use server'

export async function getWallpapers(page: number, category: string) {
  const baseUrl = process.env.BACKEND_API_URL;
  const apiUrl = `${baseUrl}/wallpapers?page=${page}${category && category !== "All" ? `&category=${encodeURIComponent(category)}` : ""}`;

  const res = await fetch(apiUrl, {
    cache: 'force-cache',
    next: { revalidate: 300 }
  });

  if (!res.ok) throw new Error('Failed to fetch');

  return res.json();
}

export async function postWallpapers(imageUrl: string, selectedCategory: string) {
  const baseUrl = process.env.BACKEND_API_URL;
  const apiUrl = `${baseUrl}/wallpapers`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: imageUrl,
      category: selectedCategory,
    }),
  });

  if (!res.ok) throw new Error("Failed to save to database");

  return res.json();
}
