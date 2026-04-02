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

  const prompt = `You are a professional chef and nutritionist. A user has the following ingredients available: ${ingredientsList}.

${allergyNote}

Based on these ingredients and constraints, generate exactly 3 delicious, practical recipes that the user can make TODAY. Each recipe must:
1. Use ONLY the available ingredients
2. NOT contain any of the excluded allergens
3. Be achievable in a home kitchen
4. Be realistic and tasty

Return ONLY a valid JSON array (no markdown, no explanation, just raw JSON) with exactly this structure for each recipe:
[
  {
    "id": "unique_id_string",
    "title": "Recipe Name",
    "time": 30,
    "difficulty": "Easy" or "Medium" or "Hard",
    "servings": 2,
    "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
    "instructions": ["step 1", "step 2", "step 3"],
    "description": "Short 1-2 sentence description",
    "matchScore": 8,
    "totalItems": 10,
    "image": null
  }
]

Respond with ONLY the JSON array, nothing else.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the text content from Gemini's response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No text content in Gemini response');
    }

    // Parse the JSON response
    let recipes: Recipe[];
    try {
      // Remove markdown code blocks if present
      let jsonString = textContent.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      recipes = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', textContent);
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
