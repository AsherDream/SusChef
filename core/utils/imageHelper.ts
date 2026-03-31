/**
 * Generates dynamic image URLs for recipes using a reliable placeholder service
 * Uses picsum.photos for consistent, highly available food image placeholders
 */

export const getRecipeImage = (query: string): string => {
  // Use picsum.photos with a seed based on the query for consistent images
  // This service is highly reliable and returns 400x600 images
  const seed = encodeURIComponent(query).substring(0, 20);
  return `https://picsum.photos/seed/${seed}/400/300`;
};

/**
 * Gets a recipe image URL with fallback to dynamic placeholder URL
 * @param imageUrl - The primary image URL (can be null or undefined)
 * @param recipeTitle - The recipe title for generating fallback image
 * @returns A valid image URL string
 */
export const getRecipeImageWithFallback = (
  imageUrl: string | null | undefined,
  recipeTitle: string
): string => {
  // If imageUrl is provided and is a non-empty string, use it
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
    return imageUrl;
  }
  // Otherwise, generate a dynamic image URL based on the recipe title
  return getRecipeImage(recipeTitle);
};
