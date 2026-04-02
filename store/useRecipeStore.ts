import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../models/Recipe';
import { generateRecipesFromPantry } from '../services/api/geminiService';
import { useAuthStore } from './useAuthStore';
import { usePantryStore } from './usePantryStore';

interface RecipeStore {
  // Saved recipes
  savedRecipes: Recipe[];
  toggleSave: (recipe: Recipe) => void;
  isRecipeSaved: (recipeId: string) => boolean;
  getSavedRecipes: () => Recipe[];
  setSavedRecipes: (recipes: Recipe[]) => void;
  removeRecipe: (recipeId: string) => void;
  
  // AI-generated recipes
  generatedRecipes: Recipe[];
  isGenerating: boolean;
  error: string | null;
  generateRecipes: (userId: string) => Promise<void>;
  clearRecipes: () => void;
  setError: (error: string | null) => void;
}

interface StorageState {
  state: RecipeStore;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      // Saved recipes state
      savedRecipes: [],

      toggleSave: (recipe: Recipe) => {
        set((state) => {
          const isSaved = state.savedRecipes.some((r) => r.id === recipe.id);
          if (isSaved) {
            // Remove the recipe
            return {
              savedRecipes: state.savedRecipes.filter((r) => r.id !== recipe.id),
            };
          } else {
            // Add the recipe
            return {
              savedRecipes: [...state.savedRecipes, recipe],
            };
          }
        });
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
      name: 'recipe-store',
      storage: {
        getItem: async (key: string) => {
          try {
            const item = await AsyncStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          } catch (error) {
            console.error('Failed to read from AsyncStorage:', error);
            return null;
          }
        },
        setItem: async (key: string, value: StorageValue<RecipeStore>) => {
          try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
          } catch (error) {
            console.error('Failed to write to AsyncStorage:', error);
          }
        },
        removeItem: async (key: string) => {
          try {
            await AsyncStorage.removeItem(key);
          } catch (error) {
            console.error('Failed to remove from AsyncStorage:', error);
          }
        },
      },
    }
  )
);
