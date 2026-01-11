export const getWallpaperName = (url: string) => {
  try {
    const regex = /\/([^/]+)\.[^/.]+$/;
    return (url.match(regex)?.[1] || "Unknown").replace(/[-_]/g, " ");
  } catch {
    return "Unknown";
  }
};

export const getOptimizedUrl = (url: string, width: number) => {
  if (!url.includes("/upload/")) return url;

  const [base, file] = url.split("/upload/");
  const transformation = `w_${width},c_limit,q_auto,f_auto`;

  return `${base}/upload/${transformation}/${file}`;
};

export const getCategories = async (backendurl: string) => {
    const res = await fetch(`${backendurl}/categories`);
    const data = await res.json();
    return data.data.categories
}