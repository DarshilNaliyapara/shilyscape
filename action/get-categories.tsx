'use server';
import api from "@/utils/axios";
import { unstable_cache } from "next/cache";

const getCachedCategoriesData = unstable_cache(
  async () => {
    
    const { data } = await api.get('/categories');
    return data.data.categories;
  },
  ['categories-list'],
  { revalidate: 1 }
);

export async function getCategories() {
  try {
    return await getCachedCategoriesData();
  } catch (error) {
    console.error("Server Action Error:", error);
    return ["all"]; 
  }
}