export const getWallpaperName = (url: string) => {
  if (!url) return "Unknown";

  try {
    const regex = /\/([^/]+)\.[^/.]+$/;
    return (url.match(regex)?.[1] || "Unknown").replace(/[-_]/g, " ");
  } catch { 
    return "Unknown"; 
  }
};

export const getOptimizedUrl = (url: string, width: number) => {
  if (!url) return ""; 

  if (!url.includes("/upload/")) return url;

  const [base, file] = url.split("/upload/");
  const transformation = `w_${width},c_limit,q_auto,f_auto`;

  return `${base}/upload/${transformation}/${file}`;
};
