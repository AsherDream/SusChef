/**
 * App Constants - Global application constants and configuration
 */

export const APP_CONSTANTS = {
  // App Info
  APP_NAME: 'SusChef',
  APP_VERSION: '1.0.0',

  // Default Values
  DEFAULT_SERVINGS: 2,
  DEFAULT_UNIT: 'pcs',
  DEFAULT_AMOUNT: 1,

  // Async Storage Keys
  STORAGE_KEYS: {
    SAVED_RECIPES: 'saved-recipes-key',
    USER_PREFERENCES: 'user-preferences-key',
    AUTH_TOKEN: 'auth-token-key',
  },

  // Timeouts
  RECIPE_GENERATION_DELAY: 1500, // ms
  IMAGE_LOAD_TIMEOUT: 5000, // ms

  // UI Constants
  MIN_SEARCH_LENGTH: 1,
  MAX_INGREDIENTS_DISPLAY: 20,
  MAX_RECENT_RECIPES: 10,

  // Recipe Categories
  RECIPE_CATEGORIES: ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'] as const,

  // Difficulty Levels
  DIFFICULTY_LEVELS: ['Easy', 'Medium', 'Hard'] as const,
};

export type RecipeCategory = (typeof APP_CONSTANTS.RECIPE_CATEGORIES)[number];
export type DifficultyLevel = (typeof APP_CONSTANTS.DIFFICULTY_LEVELS)[number];
