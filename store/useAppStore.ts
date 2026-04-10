import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark';
type DietaryStyle = 'Vegan' | 'Vegetarian' | 'Keto' | 'Paleo' | '';

interface AppState {
  // Saved recipes
  savedRecipeIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;

  // Profile preferences
  theme: ThemePreference;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;

  dietaryStyle: DietaryStyle;
  setDietaryStyle: (style: DietaryStyle) => void;

  allergies: string[];
  toggleAllergy: (item: string) => void;
  setAllergies: (items: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedRecipeIds: [],
      toggleSave: (id) => {
        const currentSaved = get().savedRecipeIds;
        const isAlreadySaved = currentSaved.includes(id);

        set({
          savedRecipeIds: isAlreadySaved
            ? currentSaved.filter((recipeId) => recipeId !== id)
            : [...currentSaved, id],
        });
      },
      isSaved: (id) => get().savedRecipeIds.includes(id),

      theme: 'light',
      isDarkMode: false,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
          isDarkMode: !state.isDarkMode,
        })),
      setTheme: (theme) => set({ theme, isDarkMode: theme === 'dark' }),

      dietaryStyle: '',
      setDietaryStyle: (style) => set({ dietaryStyle: style }),

      allergies: [],
      toggleAllergy: (item) => {
        const current = get().allergies;
        const hasItem = current.includes(item);
        set({ allergies: hasItem ? current.filter((a) => a !== item) : [...current, item] });
      },
      setAllergies: (items) => set({ allergies: items }),
    }),
    {
      name: 'suschef-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
