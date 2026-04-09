/**
 * Recipe API Service - Integration with APIs for recipe data
 */

import { Recipe } from '../../models/Recipe';
import { MOCK_RECIPES } from '../../core/constants/mockRecipes';
import { API_CONFIG } from '../../core/config/apiConfig';
import { db } from '../../core/config/firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, query, limit } from 'firebase/firestore';

// Simulate API delay to properly trigger loading states
const SIMULATED_API_DELAY = 1500; // ms

class RecipeApiService {
  /**
   * Fetch recipes based on pantry ingredients
   * Currently uses mock data; replace with actual API call when ready
   */
  async getRecipeRecommendations(ingredients: string[]): Promise<Recipe[]> {
    try {
      console.log('Fetching recipes for ingredients:', ingredients);
      
      // Simulate API delay to trigger loading UI
      await new Promise(resolve => setTimeout(resolve, SIMULATED_API_DELAY));
      
      // Filter mock recipes based on ingredients match
      if (ingredients.length === 0) {
        return MOCK_RECIPES;
      }

      // Return recipes that match at least one ingredient
      return MOCK_RECIPES.filter(recipe =>
        recipe.ingredients.some(ing =>
          ingredients.some(userIng =>
            ing.toLowerCase().includes(userIng.toLowerCase()) ||
            userIng.toLowerCase().includes(ing.toLowerCase())
          )
        )
      );
    } catch (error) {
      console.error('Error fetching recipe recommendations:', error);
      throw new Error('Failed to fetch recipe recommendations');
    }
  }

  /**
   * Fetch recipe details by ID
   * Currently uses mock data; replace with actual API call when ready
   */
  async getRecipeById(recipeId: string): Promise<Recipe | null> {
    try {
      console.log('Fetching recipe with ID:', recipeId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, SIMULATED_API_DELAY));
      
      // Return recipe from mock data if found
      return MOCK_RECIPES.find(recipe => recipe.id === recipeId) || null;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  /**
   * Search recipes by keyword
   * Currently uses mock data; replace with actual API call when ready
   */
  async searchRecipes(query: string): Promise<Recipe[]> {
    try {
      if (!query || query.trim().length === 0) {
        return MOCK_RECIPES;
      }

      console.log('Searching recipes for:', query);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, SIMULATED_API_DELAY));
      
      // Search in title and description
      const lowerQuery = query.toLowerCase();
      return MOCK_RECIPES.filter(recipe =>
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.description?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw new Error('Failed to search recipes');
    }
  }

  /**
   * Get trending recipes
   * Currently uses mock data sorted by matchScore; replace with actual API call when ready
   */
  async getTrendingRecipes(limit: number = 10): Promise<Recipe[]> {
    try {
      console.log('Fetching trending recipes');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, SIMULATED_API_DELAY));
      
      // Return top recipes by match score from mock data (shallow copy to avoid mutating global array)
      return [...MOCK_RECIPES]
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching trending recipes:', error);
      throw new Error('Failed to fetch trending recipes');
    }
  }

  /**
   * Save recipe to backend (if user is authenticated)
   * TODO: Implement actual API call when backend is ready
   */
  async saveRecipe(recipe: Recipe): Promise<boolean> {
    try {
      console.log('Saving recipe:', recipe.id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, SIMULATED_API_DELAY));
      
      // TODO: Implement actual API call
      return true;
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw new Error('Failed to save recipe');
    }
  }

  /**
   * Rate a recipe
   * TODO: Implement actual API call when backend is ready
   */
  async rateRecipe(recipeId: string, rating: number, comment?: string): Promise<boolean> {
    try {
      console.log('Rating recipe:', recipeId, 'with rating:', rating);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, SIMULATED_API_DELAY));
      
      // TODO: Implement actual API call
      return true;
    } catch (error) {
      console.error('Error rating recipe:', error);
      throw new Error('Failed to rate recipe');
    }
  }

  /**
   * Toggle saved recipe in Firestore
   * Saves or removes a recipe from user's savedRecipes subcollection
   */
  async toggleSavedRecipe(userId: string, recipe: Recipe, isSaving: boolean): Promise<void> {
    try {
      const recipeRef = doc(db, 'users', userId, 'savedRecipes', recipe.id);
      
      if (isSaving) {
        // Save recipe to Firestore
        await setDoc(recipeRef, {
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
          time: recipe.time,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          matchScore: recipe.matchScore,
          savedAt: new Date().toISOString(),
        });
        console.log('✓ Recipe saved to Firestore:', recipe.id);
      } else {
        // Remove recipe from Firestore
        await deleteDoc(recipeRef);
        console.log('✓ Recipe removed from Firestore:', recipe.id);
      }
    } catch (error) {
      console.error('Error toggling saved recipe:', error);
      throw new Error('Failed to update saved recipe');
    }
  }

  /**
   * Get all saved recipes for a user from Firestore
   */
  async getSavedRecipes(userId: string): Promise<Recipe[]> {
    try {
      const savedRecipesRef = collection(db, 'users', userId, 'savedRecipes');
      const q = query(savedRecipesRef, limit(100));
      const querySnapshot = await getDocs(q);
      
      const recipes: Recipe[] = [];
      querySnapshot.forEach((docSnapshot) => {
        recipes.push(docSnapshot.data() as Recipe);
      });
      
      console.log(`✓ Fetched ${recipes.length} saved recipes from Firestore`);
      return recipes;
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      throw new Error('Failed to fetch saved recipes');
    }
  }
}

export const recipeApiService = new RecipeApiService();
