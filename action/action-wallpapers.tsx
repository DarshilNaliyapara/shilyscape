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
  { revalidate: 1 }
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

export async function postWallpapers(
  file: File, 
  category: string, 
  tags: string[], 
  name: string
) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const fileDataUrl = `data:${file.type};base64,${base64}`;

    const response = await api.post('/wallpapers', {
      name,
      category,
      file: fileDataUrl,
      tags: Array.isArray(tags) ? tags : [],
    },{ headers: {
        "Content-Type": "application/json"
    }});
    return response.data;
    
  } catch (error: any) {
    const serverMessage = error.response.data.message;
    console.error("Post Wallpaper Error:", serverMessage);
    throw new Error(serverMessage);
  }
}