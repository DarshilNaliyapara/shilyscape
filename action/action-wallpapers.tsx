'use server'

import { BASE_URL } from "@/utils/axios";

export async function getWallpapers(page: number = 1, category?: string) {
  const apiUrl = `${BASE_URL}/wallpapers?page=${page}${category && category !== "All" ? `&category=${encodeURIComponent(category)}` : ""}`;

  const res = await fetch(apiUrl, {
    cache: 'force-cache',
    next: { revalidate: 300 }
  });

  if (!res.ok) throw new Error('Failed to fetch');

  return res.json();
}

export async function postWallpapers(imageUrl: string, selectedCategory: string) {
  const apiUrl = `${BASE_URL}/wallpapers`;

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
