/**
 * Gemini API Service - Integration with Google's Gemini AI for recipe generation
 */

import { Recipe } from '../../models/Recipe';
import { getRecipeImage } from '../../core/utils/imageHelper';

/**
 * Generates recipes from a list of ingredients and allergies using Google Gemini AI
 * @param ingredients - Array of ingredient names the user has available
 * @param allergies - Array of allergens the user has
 * @returns Promise resolving to an array of generated recipes
 */
export const generateRecipesFromPantry = async (
  ingredients: string[],
  allergies: string[]
): Promise<Recipe[]> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'paste_your_key_here_no_quotes') {
    throw new Error(
      'Gemini API key is not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.'
    );
  }

  const ingredientsList = ingredients.length > 0 
    ? ingredients.join(', ') 
    : 'common pantry staples (oil, salt, pepper, rice, pasta)';
  
  const allergyNote = allergies.length > 0
    ? `IMPORTANT: Exclude these allergens: ${allergies.join(', ')}. Do not include these in any recipe.`
    : 'The user has no known allergies.';

  const prompt = `
Available: ${ingredientsList}
Avoid: ${allergyNote}

Generate exactly 3 practical recipes as a JSON array.
Each recipe MUST have these exact keys:
id (string), title (string), time (number), difficulty (string), servings (number), ingredients (array of strings), instructions (array of strings), description (string), matchScore (number), totalItems (number), image (null).
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText, errorText);
      if (response.status === 503) {
        throw new Error('Chef Gemini is experiencing high traffic right now. Please tap Generate again in a few seconds!');
      }
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;

    if (!rawText) {
      throw new Error('No text content in Gemini response');
    }

    // Parse the JSON response
    let recipes: Recipe[];
    try {
      recipes = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', rawText);
      throw new Error('Failed to parse recipe JSON from AI response');
    }

    // Validate that we have an array of recipes
    if (!Array.isArray(recipes)) {
      throw new Error('AI response is not an array of recipes');
    }

    // Ensure each recipe has the required fields
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
      image: getRecipeImage(null), // Use fallback image utility
    }));

    console.log(`✓ Generated ${validatedRecipes.length} recipes from Gemini AI`);
    return validatedRecipes;
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }
};
