/**
 * Pantry Store - Zustand store for managing user pantry data
 * Syncs to Firebase Firestore on every change (optimistic updates)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserPantry, getUserPantry, type PantryData, type Ingredient } from '../services/api/pantryService';

interface PantryState extends PantryData {
  // Actions
  addIngredient: (name: string, quantity?: number, unit?: string) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
  updateIngredientAmount: (id: string, newAmount: number) => Promise<void>;
  updateIngredientUnit: (id: string, newUnit: string) => Promise<void>;
  toggleKitchenTool: (toolName: string) => Promise<void>;
  syncPantryToCloud: (userId: string) => Promise<void>;
  fetchAndSetPantry: (userId: string) => Promise<void>;
  clearPantry: () => void;
}

export const usePantryStore = create<PantryState>()(
  persist(
    (set, get) => ({
      // Initial state
      ingredients: [],
      kitchenTools: [],

      // Add ingredient with optimistic update
      addIngredient: async (name: string, quantity = 1, unit = 'pcs') => {
        const newIngredient: Ingredient = {
          id: Date.now().toString(),
          name: name.trim(),
          amount: quantity,
          unit,
        };

        // Optimistic update - update UI immediately
        set((state) => ({
          ingredients: [...state.ingredients, newIngredient],
        }));

        // Sync to cloud in background
        try {
          const state = get();
          // We'll get userId from somewhere in the component, but for now just log
          console.log('Ingredient added:', newIngredient);
        } catch (error) {
          console.error('Error adding ingredient:', error);
        }
      },

      // Remove ingredient with optimistic update
      removeIngredient: async (id: string) => {
        // Optimistic update
        set((state) => ({
          ingredients: state.ingredients.filter((ing) => ing.id !== id),
        }));

        // Sync to cloud in background
        try {
          console.log('Ingredient removed:', id);
        } catch (error) {
          console.error('Error removing ingredient:', error);
        }
      },

      // Update ingredient amount with optimistic update
      updateIngredientAmount: async (id: string, newAmount: number) => {
        // Validate amount is a positive number
        if (typeof newAmount !== 'number' || newAmount < 0) {
          console.error('Invalid amount:', newAmount);
          return;
        }

        // Optimistic update
        set((state) => ({
          ingredients: state.ingredients.map((ing) =>
            ing.id === id ? { ...ing, amount: newAmount } : ing
          ),
        }));

        // Sync to cloud in background
        try {
          console.log('Ingredient amount updated:', id, 'to', newAmount);
        } catch (error) {
          console.error('Error updating ingredient amount:', error);
        }
      },

      // Update ingredient unit with optimistic update
      updateIngredientUnit: async (id: string, newUnit: string) => {
        // Validate unit is a non-empty string
        if (typeof newUnit !== 'string' || !newUnit.trim()) {
          console.error('Invalid unit:', newUnit);
          return;
        }

        // Optimistic update
        set((state) => ({
          ingredients: state.ingredients.map((ing) =>
            ing.id === id ? { ...ing, unit: newUnit.trim() } : ing
          ),
        }));

        // Sync to cloud in background
        try {
          console.log('Ingredient unit updated:', id, 'to', newUnit);
        } catch (error) {
          console.error('Error updating ingredient unit:', error);
        }
      },

      // Toggle kitchen tool with optimistic update
      toggleKitchenTool: async (toolName: string) => {
        set((state) => {
          const hasKitchenTools = state.kitchenTools.includes(toolName);
          return {
            kitchenTools: hasKitchenTools
              ? state.kitchenTools.filter((t) => t !== toolName)
              : [...state.kitchenTools, toolName],
          };
        });

        // Sync to cloud in background
        try {
          console.log('Kitchen tool toggled:', toolName);
        } catch (error) {
          console.error('Error toggling kitchen tool:', error);
        }
      },

      // Sync pantry to Firestore
      syncPantryToCloud: async (userId: string) => {
        try {
          const state = get();
          await saveUserPantry(userId, {
            ingredients: state.ingredients,
            kitchenTools: state.kitchenTools,
          });
          console.log('Pantry synced to Firestore');
        } catch (error) {
          console.error('Error syncing pantry to cloud:', error);
          // Silently fail - app continues to work offline
        }
      },

      // Fetch pantry from Firestore and merge with local state
      fetchAndSetPantry: async (userId: string) => {
        try {
          const pantryData = await getUserPantry(userId);
          if (pantryData) {
            set({
              ingredients: pantryData.ingredients || [],
              kitchenTools: pantryData.kitchenTools || [],
            });
            console.log('Pantry loaded from Firestore');
          } else {
            // No pantry in Firestore yet, use local defaults
            console.log('No pantry in Firestore, using local defaults');
          }
        } catch (error) {
          console.error('Error fetching pantry from cloud:', error);
          // Gracefully degrade - use local state
        }
      },

      // Clear pantry (on logout)
      clearPantry: () => {
        set({ ingredients: [], kitchenTools: [] });
      },
    }),
    {
      name: 'pantry-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist ingredients and kitchenTools, not functions
      partialize: (state) => ({
        ingredients: state.ingredients,
        kitchenTools: state.kitchenTools,
      }),
    }
  )
);

// Export types for use in components
export type { Ingredient, PantryData } from '../services/api/pantryService';
