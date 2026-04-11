/**
 * Gemini API Service - Integration with Google's Gemini AI for recipe generation
 * 
 * SECURITY NOTE: Gemini API calls are now proxied through Firebase Cloud Functions.
 * This keeps the API key server-side and prevents exposure in client bundles.
 */

import { Recipe } from '../../models/Recipe';
import { getRecipeImage } from '../../core/utils/imageHelper';
import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * Generates recipes from a list of ingredients and allergies
 * Calls the secure backend Cloud Function (API key stays on server)
 * 
 * @param ingredients - Array of ingredient names the user has available
 * @param allergies - Array of allergens the user has
 * @returns Promise resolving to an array of generated recipes
 */
export const generateRecipesFromPantry = async (
  ingredients: string[],
  allergies: string[]
): Promise<Recipe[]> => {
  try {
    // Get reference to Cloud Functions
    const functions = getFunctions();

    // Get the generateRecipes Cloud Function
    const generateRecipesFn = httpsCallable(functions, 'generateRecipes');

    // Call the function with ingredients and allergies
    const response = await generateRecipesFn({
      ingredients: ingredients.length > 0 ? ingredients : [],
      allergies: allergies.length > 0 ? allergies : [],
    });

    // Extract recipes from response
    const data = response.data as { recipes: Recipe[]; count: number };

    if (!data || !Array.isArray(data.recipes)) {
      throw new Error('Invalid response format from generateRecipes function');
    }

    // Validate and normalize each recipe
    const validatedRecipes = data.recipes.map((recipe: Recipe) => ({
      id: recipe.id || `recipe_${Date.now()}_${Math.random()}`,
      title: recipe.title || 'Untitled Recipe',
      time: recipe.time || 30,
      difficulty: recipe.difficulty || 'Medium',
      servings: recipe.servings || 2,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      description: recipe.description || '',
      matchScore: recipe.matchScore || 7,
      totalItems: recipe.totalItems || 10,
      image: getRecipeImage(null), // Use fallback image utility
    }));

    console.log(`✓ Generated ${validatedRecipes.length} recipes from Cloud Function`);
    return validatedRecipes;
  } catch (error) {
    console.error('Error generating recipes:', error);

    // Provide user-friendly error messages
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('unavailable')) {
        throw new Error(
          'Chef Gemini is experiencing high traffic right now. Please try again in a few seconds!'
        );
      }

      if (errorMessage.includes('quota') || errorMessage.includes('resource')) {
        throw new Error('API request limit reached. Please try again later.');
      }

      if (errorMessage.includes('permission') || errorMessage.includes('auth')) {
        throw new Error('Authentication failed. Please contact support.');
      }
    }

    throw new Error(
      'Failed to generate recipes. Please check your internet and try again.'
    );
  }
};
