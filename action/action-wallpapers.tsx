'use server';
import api from "@/utils/axios";
import { unstable_cache } from "next/cache";

function transformData(responseBody: any) {
  const content = responseBody?.data;

  if (content && Array.isArray(content.wallpapers)) {
    content.wallpapers = content.wallpapers
      .filter((w: any) => w && w.imgLink)
      .map((w: any) => ({
        ...w,
        tags: Array.isArray(w.tags)
          ? w.tags.map((t: any) => (typeof t === 'object' && t.name ? t.name : t))
          : []
      }));
  }
  return responseBody;
}

const getCachedBrowsingData = unstable_cache(
  async (cursor?: string, category?: string) => {
    const params: Record<string, string> = {};

    if (cursor) params.cursor = cursor;
    if (category && category !== "All") params.category = category;

    const { data } = await api.get('/wallpapers', { params });
    
    return transformData(data);
  },
  ['wallpapers-browse'],
  { 
    revalidate: 150, 
    tags: ['wallpapers']
  }
);

export async function getWallpapers(cursor?: string, category?: string, query?: string) {
  try {
    if (query) {
      const params = { 
        q: query,
        cursor: cursor || undefined
      };
      
      const { data } = await api.get('/wallpapers', { params });
      return transformData(data);
    }

    return await getCachedBrowsingData(cursor || undefined, category || undefined);

  } catch (error) {
    console.error("Wallpaper Fetch Error:", error);
    return { 
      success: false, 
      data: { 
        wallpapers: [], 
        pagination: { nextCursor: null, hasMore: false } 
      } 
    };
  }
}