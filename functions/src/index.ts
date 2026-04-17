import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Cloud Function: generateRecipes
 *
 * Securely generates recipes from user ingredients using Google Gemini AI.
 * API key is stored server-side for security (not exposed to client).
 *
 * @param data - { ingredients: string[], allergies?: string[] }
 * @returns Array of generated recipes
 */
export const generateRecipes = onCall(
  { cors: [/localhost/, /127\.0\.0\.1/] },
  async (request) => {
    try {
      const { ingredients = [], allergies = [], kitchenTools = [], dietaryOptions = [] } = request.data;

      // Validate input
      if (!Array.isArray(ingredients)) {
        throw new HttpsError(
          'invalid-argument',
          'ingredients must be an array of strings'
        );
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new HttpsError(
          'internal',
          'GEMINI_API_KEY environment variable not configured'
        );
      }

      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Build the prompt
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
id (string), title (string), time (number), difficulty (string), servings (number), ingredients (array of strings), instructions (array of strings), description (string), matchScore (number), totalItems (number), image (null).`;

      // Call Gemini API with JSON mode
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

      // Parse and validate JSON response
      let recipes;
      try {
        recipes = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🔴 JSON PARSE FAILED. Raw string was:', responseText);
        throw new HttpsError('internal', 'Failed to parse Gemini response as JSON');
      }

      // Ensure response is array
      if (!Array.isArray(recipes)) {
        throw new HttpsError('internal', 'Gemini response is not an array of recipes');
      }

      // Return recipes to client
      return {
        success: true,
        recipes: recipes,
        count: recipes.length,
      };
    } catch (error) {
      console.error('🚨 CRITICAL BACKEND ERROR:', error);
      // Handle specific error cases
      if (error instanceof HttpsError) {
        throw error;
      }

      // Google API errors (rate limit, service unavailable, etc.)
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // Rate limiting / Service temporarily unavailable
        if (errorMessage.includes('503') || errorMessage.includes('unavailable')) {
          throw new HttpsError(
            'unavailable',
            'Chef Gemini is experiencing high traffic right now. Please try again in a few seconds!'
          );
        }

        // Network / Quota errors
        if (
          errorMessage.includes('quota') ||
          errorMessage.includes('resource') ||
          errorMessage.includes('429')
        ) {
          throw new HttpsError(
            'resource-exhausted',
            'API request limit reached. Please try again later.'
          );
        }

        // Authentication errors
        if (errorMessage.includes('api') || errorMessage.includes('auth')) {
          throw new HttpsError('permission-denied', 'API key authentication failed');
        }
      }

      // Generic error fallback
      throw new HttpsError(
        'internal',
        'Failed to generate recipes. Please try again.'
      );
    }
  }
);
