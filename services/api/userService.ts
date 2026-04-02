/**
 * User Service - Firestore operations for user profile data
 * Handles persistence of allergies and PDPA consent across sessions
 */

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../core/config/firebaseConfig';

interface UserProfile {
  allergies: string[];
  pdpaConsent: boolean;
}

/**
 * Save user profile data to Firestore
 * Uses merge mode to preserve other document fields
 * @param userId - Firebase auth user ID
 * @param data - User profile data (allergies and consent)
 * @returns Promise that resolves when data is saved
 */
export const saveUserProfile = async (
  userId: string,
  data: UserProfile
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        allergies: data.allergies,
        pdpaConsent: data.pdpaConsent,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`User profile saved for ${userId}`);
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save user profile. Please try again.');
  }
};

/**
 * Fetch user profile data from Firestore
 * @param userId - Firebase auth user ID
 * @returns Promise that resolves to UserProfile or null if not found
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        allergies: data.allergies || [],
        pdpaConsent: data.pdpaConsent || false,
      };
    }

    console.log(`No profile found for user ${userId}`);
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile. Please try again.');
  }
};
