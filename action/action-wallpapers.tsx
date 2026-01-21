'use server'

import { BASE_URL } from "@/utils/axios";

export async function getWallpapers(page: number = 1, category?: string, query?: string) {
  const params = new URLSearchParams();

  params.append("page", page.toString());

  if (query) {
    params.append("q", query);
  } else if (category && category !== "All") {
    params.append("category", category);
  }

  const apiUrl = `${BASE_URL}/wallpapers?${params.toString()}`;

  const res = await fetch(apiUrl, {
    cache: query ? 'no-store' : 'force-cache',
    next: query ? undefined : { revalidate: 3600 }
  });

  if (!res.ok) throw new Error('Failed to fetch');

  const json = await res.json();

  if (json.data && Array.isArray(json.data.wallpapers)) {
    json.data.wallpapers = json.data.wallpapers
      .filter((w: any) => w && w.imgLink) 
      .map((w: any) => ({
        ...w,
        tags: Array.isArray(w.tags)
          ? w.tags.map((t: any) => (typeof t === 'object' && t.name ? t.name : t))
          : []
      }));
  }

  return json;
}

export async function postWallpapers(imageUrl: string, selectedCategory: string, tags: string[]) {
  const apiUrl = `${BASE_URL}/wallpapers`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: imageUrl,
      category: selectedCategory,
      tags: tags
    }),
  });

  if (!res.ok) throw new Error("Failed to save to database");

  return res.json();
}
