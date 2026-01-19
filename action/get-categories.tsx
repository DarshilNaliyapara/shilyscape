'use server';
import api from "@/utils/axios";

export async function getCategories() {
 
  try {
    const { data } = await api.get('/categories'); 
    let categories = ["all", ...data.data.categories];
    return categories;
  } catch (error) {
    console.error("Server Action Error:", error);
    return [];
  }
}
