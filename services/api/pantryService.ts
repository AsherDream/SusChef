/**
 * Pantry Service - Firebase Firestore integration for user pantry data
 */

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../core/config/firebaseConfig';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

export interface PantryData {
  ingredients: Ingredient[];
  kitchenTools: string[];
  updatedAt?: number;
}

/**
 * Save user's pantry data to Firestore
 * Uses merge: true to avoid overwriting other fields
 */
export async function saveUserPantry(userId: string, data: PantryData): Promise<void> {
  try {
    const pantryRef = doc(db, 'pantries', userId);
    await setDoc(
      pantryRef,
      {
        ...data,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
    console.log('Pantry saved to Firestore:', userId);
  } catch (error) {
    console.error('Error saving pantry:', error);
    throw new Error('Failed to save pantry data. Please try again.');
  }
}

/**
 * Fetch user's pantry data from Firestore
 * Returns null if pantry doesn't exist yet
 */
export async function getUserPantry(userId: string): Promise<PantryData | null> {
  try {
    const pantryRef = doc(db, 'pantries', userId);
    const pantrySnapshot = await getDoc(pantryRef);

    if (!pantrySnapshot.exists()) {
      console.log('No pantry found for user:', userId);
      return null;
    }

    const data = pantrySnapshot.data() as PantryData;
    console.log('Pantry fetched from Firestore:', userId);
    console.log('Loaded Kitchen Tools:', data.kitchenTools);
    return data;
  } catch (error) {
    console.error('Error fetching pantry:', error);
    // Graceful degradation: return null to use local defaults
    return null;
  }
}
