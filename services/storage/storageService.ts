/**
 * Storage Service - Local storage for user data using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../../core/constants/appConstants';

class StorageService {
  /**
   * Get saved recipes from local storage
   */
  async getSavedRecipes(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.SAVED_RECIPES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting saved recipes:', error);
      return [];
    }
  }

  /**
   * Save recipes to local storage
   */
  async saveSavedRecipes(recipes: any[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(recipes));
      return true;
    } catch (error) {
      console.error('Error saving recipes:', error);
      return false;
    }
  }

  /**
   * Get user preferences from local storage
   */
  async getUserPreferences(): Promise<Record<string, any>> {
    try {
      const data = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }

  /**
   * Save user preferences to local storage
   */
  async saveUserPreferences(preferences: Record<string, any>): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        APP_CONSTANTS.STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences)
      );
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  }

  /**
   * Get auth token from local storage
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Save auth token to local storage
   */
  async saveAuthToken(token: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error saving auth token:', error);
      return false;
    }
  }

  /**
   * Remove auth token from local storage
   */
  async removeAuthToken(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
      return true;
    } catch (error) {
      console.error('Error removing auth token:', error);
      return false;
    }
  }

  /**
   * Clear all stored data
   */
  async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(Object.values(APP_CONSTANTS.STORAGE_KEYS));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
