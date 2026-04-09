import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../models/Recipe';
import { generateRecipesFromPantry } from '../services/api/geminiService';
import { recipeApiService } from '../services/api/recipeApiService';
import { useAuthStore } from './useAuthStore';
import { usePantryStore } from './usePantryStore';

interface RecipeStore {
  // Saved recipes
  savedRecipes: Recipe[];
  toggleSave: (userId: string, recipe: Recipe) => Promise<void>;
  isRecipeSaved: (recipeId: string) => boolean;
  getSavedRecipes: () => Recipe[];
  setSavedRecipes: (recipes: Recipe[]) => void;
  removeRecipe: (recipeId: string) => void;
  fetchSavedRecipes: (userId: string) => Promise<void>;
  
  // AI-generated recipes
  generatedRecipes: Recipe[];
  isGenerating: boolean;
  error: string | null;
  generateRecipes: (userId: string) => Promise<void>;
  clearRecipes: () => void;
  setError: (error: string | null) => void;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      // Saved recipes state
      savedRecipes: [],

      toggleSave: async (userId: string, recipe: Recipe) => {
        const { savedRecipes } = get();
        const isSaved = savedRecipes.some((r) => r.id === recipe.id);

        // Optimistic update
        if (isSaved) {
          set({
            savedRecipes: savedRecipes.filter((r) => r.id !== recipe.id),
          });
        } else {
          set({
            savedRecipes: [...savedRecipes, recipe],
          });
        }

        // Sync with Firestore
        try {
          await recipeApiService.toggleSavedRecipe(userId, recipe, !isSaved);
        } catch (error) {
          // Revert optimistic update on error
          set({ savedRecipes });
          console.error('Failed to sync bookmark to Firestore:', error);
          throw error;
        }
      },

      fetchSavedRecipes: async (userId: string) => {
        try {
          const recipes = await recipeApiService.getSavedRecipes(userId);
          set({ savedRecipes: recipes });
        } catch (error) {
          console.error('Failed to fetch saved recipes:', error);
          throw error;
        }
      },

      removeRecipe: (recipeId: string) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((r) => r.id !== recipeId),
        }));
      },

      setSavedRecipes: (recipes: Recipe[]) => {
        set({ savedRecipes: recipes });
      },

      isRecipeSaved: (recipeId: string) => {
        const { savedRecipes } = get();
        return savedRecipes.some((r) => r.id === recipeId);
      },

      getSavedRecipes: () => {
        return get().savedRecipes;
      },

      // AI-generated recipes state
      generatedRecipes: [],
      isGenerating: false,
      error: null,

      generateRecipes: async (userId: string) => {
        set({ isGenerating: true, error: null });

        try {
          // Get user's allergies from auth store
          const authState = useAuthStore.getState();
          const allergies = authState.user?.allergies || [];

          // Get user's ingredients from pantry store
          const pantryState = usePantryStore.getState();
          const ingredients = pantryState.ingredients.map(
            (ing) => `${ing.name} (${ing.amount} ${ing.unit})`
          );

          // Validate that user has at least some ingredients
          if (ingredients.length === 0) {
            throw new Error(
              'Please add at least one ingredient to your pantry to generate recipes.'
            );
          }

          // Call Gemini API to generate recipes
          const recipes = await generateRecipesFromPantry(ingredients, allergies);

          set({ generatedRecipes: recipes, isGenerating: false });
          console.log(`✓ Successfully generated ${recipes.length} recipes`);
        } catch (error) {
          const errorMessage =
            error instanceof Error 
              ? error.message 
              : 'Failed to generate recipes';
          console.error('Error generating recipes:', errorMessage);
          set({ error: errorMessage, isGenerating: false });
        }
      },

      clearRecipes: () => {
        set({ generatedRecipes: [], error: null });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => AsyncStorage),      partialize: (state) => ({
        generatedRecipes: state.generatedRecipes,
        savedRecipes: state.savedRecipes,
      }),    }
  )
);
