/**
 * Gemini API Service - Direct Frontend Integration
 *
 * SHOWCASE MODE: Direct SDK calls for presentation/demo purposes.
 * API key is exposed in client bundle for simplicity.
 */

import { Recipe } from '../../models/Recipe';
import { getRecipeImage } from '../../core/utils/imageHelper';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generates recipes from a list of ingredients and allergies
 * Direct call to Gemini API from frontend
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
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'paste_your_key_here_no_quotes') {
      throw new Error(
        'EXPO_PUBLIC_GEMINI_API_KEY is not configured. Add it to your .env file.'
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const ingredientsList =
      ingredients.length > 0
        ? ingredients.join(', ')
        : 'common pantry staples (oil, salt, pepper, rice, pasta)';

    const allergyNote =
      allergies.length > 0
        ? `IMPORTANT: Exclude these allergens: ${allergies.join(
            ', '
          )}. Do not include these in any recipe.`
        : 'The user has no known allergies.';

    const prompt = `
Available: ${ingredientsList}
Avoid: ${allergyNote}

Generate exactly 3 practical recipes as a JSON array.
Each recipe MUST have these exact keys:
id (string), title (string), time (number), difficulty (string), servings (number), ingredients (array of strings), instructions (array of strings), description (string), matchScore (number), totalItems (number), image (null).
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const responseText = result.response.text();
    console.log('🟢 GEMINI RAW RESPONSE:', responseText);

    let recipes: Recipe[];
    try {
      recipes = JSON.parse(responseText);
    } catch (parseError) {
      console.error('🔴 JSON PARSE FAILED. Raw string was:', responseText);
      throw new Error('Failed to parse recipe JSON from AI response');
    }

    if (!Array.isArray(recipes)) {
      throw new Error('AI response is not an array of recipes');
    }

    const validatedRecipes = recipes.map((recipe) => ({
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
      image: getRecipeImage(null),
    }));

    console.log(
      `✓ Generated ${validatedRecipes.length} recipes from Gemini AI`
    );
    return validatedRecipes;
  } catch (error) {
    console.error('🚨 CRITICAL BACKEND ERROR:', error);

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('503') || errorMessage.includes('unavailable')) {
        throw new Error(
          'Chef Gemini is experiencing high traffic right now. Please try again in a few seconds!'
        );
      }

      if (
        errorMessage.includes('quota') ||
        errorMessage.includes('resource') ||
        errorMessage.includes('429')
      ) {
        throw new Error('API request limit reached. Please try again later.');
      }

      if (errorMessage.includes('api') || errorMessage.includes('auth')) {
        throw new Error('API key authentication failed');
      }
    }

    throw new Error(
      'Failed to generate recipes. Please check your internet and try again.'
    );
  }
};
