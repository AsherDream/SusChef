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
/**
 * Fallback recipe for demo day - returns when all API retries fail
 * Ensures app appears functional even during API outages
 */
const getFallbackRecipes = (): Recipe[] => {
  const fallbackMarkdown = `### 🍳 Chef's Special Skillet

Based on your ingredients, here is a delicious and easy recipe!

**Ingredients:**
- 2 cups fresh vegetables, chopped
- 2 tablespoons oil
- Salt and pepper to taste
- Your favorite spices

**Instructions:**
1. **Prep:** Wash and chop your fresh ingredients.
2. **Sauté:** Heat a tablespoon of oil in a pan over medium heat. Add your ingredients and cook until tender (5-7 minutes).
3. **Season:** Add a pinch of salt, pepper, and your favorite spices.
4. **Simmer:** Let the mixture cook together for another 2-3 minutes until flavors blend.
5. **Serve:** Plate beautifully and enjoy your sustainable meal!

*(Enjoy this SusChef signature dish! - Demo Mode)*`;

  return [
    {
      id: `recipe_demo_${Date.now()}`,
      title: "Chef's Special Skillet",
      time: 15,
      difficulty: 'Easy',
      servings: 2,
      ingredients: [
        '2 cups fresh vegetables, chopped',
        '2 tablespoons oil',
        'Salt and pepper to taste',
        'Your favorite spices',
      ],
      instructions: [
        'Wash and chop your fresh ingredients.',
        'Heat a tablespoon of oil in a pan over medium heat. Add your ingredients and cook until tender (5-7 minutes).',
        'Add a pinch of salt, pepper, and your favorite spices.',
        'Let the mixture cook together for another 2-3 minutes until flavors blend.',
        'Plate beautifully and enjoy your sustainable meal!',
      ],
      description: fallbackMarkdown,
      matchScore: 8,
      totalItems: 4,
      image: getRecipeImage(null),
    },
  ];
};

export const generateRecipesFromPantry = async (
  ingredients: string[],
  allergies: string[],
  kitchenTools: string[] = [],
  dietaryOptions: string[] = []
): Promise<Recipe[]> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'paste_your_key_here_no_quotes') {
      throw new Error(
        'EXPO_PUBLIC_GEMINI_API_KEY is not configured. Add it to your .env file.'
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const ingredientsList =
      ingredients.length > 0
        ? ingredients.join(', ')
        : 'common pantry staples (oil, salt, pepper, rice, pasta)';

    const toolsList = kitchenTools.length > 0 ? kitchenTools.join(', ') : 'No specific tools';

    const dietaryList = dietaryOptions.length > 0 ? dietaryOptions.join(', ') : 'None';

    const allergyNote =
      allergies.length > 0
        ? allergies.join(', ')
        : 'None';

    const prompt = `You are a professional chef. Create a recipe using ONLY the following ingredients (you do not have to use all of them, but do not add unlisted major ingredients): ${ingredientsList}. Also utilize these kitchen tools: ${toolsList}. DIETARY RESTRICTIONS: ${dietaryList}. ALLERGIES TO STRICTLY AVOID: ${allergyNote}.

Generate exactly 3 practical recipes as a JSON array.
Each recipe MUST have these exact keys:
id (string), title (string), time (number), difficulty (string), servings (number), ingredients (array of strings), instructions (array of strings), description (string), matchScore (number), totalItems (number), image (null).
`;

    // 🔄 EXPONENTIAL BACKOFF WITH JITTER RETRY LOOP
    const maxRetries = 5;
    let delay = 1000; // Start at 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`🔄 Gemini API Attempt ${attempt + 1}/${maxRetries}...`);

        // 1. Try to call the Gemini API
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
        return validatedRecipes; // SUCCESS - return immediately!
      } catch (error) {
        console.warn(
          `❌ Gemini API Attempt ${attempt + 1} failed:`,
          error instanceof Error ? error.message : String(error)
        );

        // 2. If this was the LAST attempt, trigger the Demo Day Fallback
        if (attempt === maxRetries - 1) {
          console.error(
            '⚠️ All 5 API retries failed. Triggering fallback recipe for demo day.'
          );
          return getFallbackRecipes(); // Return fallback instead of throwing!
        }

        // 3. Exponential Backoff with Jitter (Wait, then loop again)
        const jitter = Math.random() * 500; // Random jitter up to 500ms
        const totalDelay = delay + jitter;
        console.log(
          `⏳ Waiting ${totalDelay.toFixed(0)}ms before retry (delay: ${delay}ms + jitter: ${jitter.toFixed(0)}ms)...`
        );
        await new Promise((resolve) => setTimeout(resolve, totalDelay));
        delay *= 2; // Double the delay for next iteration
      }
    }

    // Fallback: should never reach here, but just in case
    return getFallbackRecipes();
  } catch (error) {
    console.error('🚨 CRITICAL ERROR (outside retry loop):', error);

    // Handle API key configuration errors immediately
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('api key') || errorMessage.includes('not configured')) {
        throw new Error(
          'API key is not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY.'
        );
      }
    }

    // For other critical errors, fall back to demo recipe
    console.error('Returning fallback recipe due to critical error');
    return getFallbackRecipes();
  }
};
