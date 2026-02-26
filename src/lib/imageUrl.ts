/**
 * Convert relative image paths to full URLs
 * @param imagePath - Relative path like "/uploads/image.jpg"
 * @returns Full URL like "http://localhost:8000/uploads/image.jpg"
 */
export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "/placeholder-image.png";

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path, prepend the API base URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${apiUrl}${imagePath}`;
};
