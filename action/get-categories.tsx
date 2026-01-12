'use server';

export async function getCategories() {
  const baseUrl = process.env.BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not defined in .env.local");
  }

  try {
    const res = await fetch(`${baseUrl}/categories`, {
      cache: 'no-store' 
    });

    if (!res.ok) throw new Error('Failed to fetch categories');
    const response = await res.json()
    return response.data.categories;
  } catch (error) {
    console.error("Server Action Error:", error);
    return []; 
  }
}
