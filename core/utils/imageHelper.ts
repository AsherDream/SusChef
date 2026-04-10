/**
 * Image utility for recipes
 * Handles image fallback for recipes without explicit images (e.g., AI-generated recipes)
 * This ensures the UI never breaks with blank white squares
 */

// High-quality generic food placeholder (fallback for recipes without images)
const GENERIC_FOOD_PLACEHOLDER =
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80';

/**
 * Gets a recipe image with fallback to a generic placeholder
 * @param imageUrl - The recipe's specific image URL (can be null or undefined)
 * @returns A valid image URL string - either the provided URL or a generic food placeholder
 *
 * This function ensures:
 * - Each recipe displays its specific image if available
 * - AI-generated recipes without images fall back to a professional food placeholder
 * - The UI never shows broken images or blank squares
 */
export const getRecipeImage = (imageUrl?: string | null): string => {
  // If imageUrl is provided and is a non-empty string, use it
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
    return imageUrl;
  }
  // Otherwise, return the generic food placeholder (safety net for new recipes)
  return GENERIC_FOOD_PLACEHOLDER;
};

/**
 * Gets a recipe image with fallback (legacy function - kept for backwards compatibility)
 * @param imageUrl - The recipe's specific image URL (can be null or undefined)
 * @param recipeTitle - The recipe title (used only for backwards compatibility, not used in logic)
 * @returns A valid image URL string
 *
 * @deprecated Use `getRecipeImage()` instead. This wrapper is kept for migration purposes.
 */
export const getRecipeImageWithFallback = (
  imageUrl: string | null | undefined,
  recipeTitle?: string
): string => {
  return getRecipeImage(imageUrl);
};
