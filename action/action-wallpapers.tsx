'use server';
import api from "@/utils/axios";
import { revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

function transformData(data: any) {
  if (data.data && Array.isArray(data.data.wallpapers)) {
    data.data.wallpapers = data.data.wallpapers
      .filter((w: any) => w && w.imgLink)
      .map((w: any) => ({
        ...w,
        tags: Array.isArray(w.tags)
          ? w.tags.map((t: any) => (typeof t === 'object' && t.name ? t.name : t))
          : []
      }));
  }
  return data;
}

const getCachedBrowsingData = unstable_cache(
  async (page: number, category?: string) => {
    const params: any = { page };
    if (category && category !== "All") params.category = category;

    const { data } = await api.get('/wallpapers', { params });
    return transformData(data);
  },
  ['wallpapers-browse'],
  { revalidate: 300 }
);

export async function getWallpapers(page: number = 1, category?: string, query?: string) {
  try {
    if (query) {
      const params = { page, q: query };
      const { data } = await api.get('/wallpapers', { params });
      return transformData(data);
    }
    return await getCachedBrowsingData(page, category);

  } catch (error) {
    console.error("Wallpaper Fetch Error:", error);
    return { data: { wallpapers: [] } }; 
  }
}

export async function postWallpapers(imageUrl: string, selectedCategory: string, tags: string[]) {
  try {
    const { data } = await api.post('/wallpapers', {
      url: imageUrl,
      category: selectedCategory,
      tags: tags
    });

    revalidateTag('wallpapers-browse', 'default'); 

    return data;

  } catch (error) {
    console.error("Post Wallpaper Error:", error);
    throw new Error("Failed to save to database");
  }
}