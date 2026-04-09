import { RouteNames } from './routeNames';

// 1. Types for the outer Stack (Landing -> Login -> App)
export type RootStackParamList = {
  [RouteNames.Landing]: undefined;
  [RouteNames.Login]: undefined;
  [RouteNames.Register]: undefined;
  [RouteNames.ForgotPassword]: undefined;
  [RouteNames.MainApp]: undefined; 
};

// 2. Types for the inner Tabs
export type TabParamList = {
  [RouteNames.Pantry]: undefined;
  [RouteNames.Recipes]: undefined;
  [RouteNames.Saved]: undefined;
  [RouteNames.Profile]: undefined;
  [RouteNames.RecipeDetail]: { recipeId: string };
};

export type RecipesStackParamList = {
  [RouteNames.RecipeResultsScreen]: undefined;
  [RouteNames.RecipeDetail]: { recipeId: string };
};

export type PantryStackParamList = {
  [RouteNames.PantryScreen]: undefined;
  [RouteNames.RecipeResults]: undefined;
  [RouteNames.RecipeDetail]: { recipeId: string };
};

export type ProfileStackParamList = {
  [RouteNames.ProfileScreen]: undefined;
  [RouteNames.SettingsDetail]: undefined;
};