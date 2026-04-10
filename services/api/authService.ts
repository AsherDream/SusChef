/**
 * Auth Service - Firebase authentication operations
 * Handles signup, login, logout, and password reset
 */

import { signOut } from 'firebase/auth';
import { auth } from '../../core/config/firebaseConfig';

/**
 * Sign out the current user and terminate all sessions
 * @returns Promise that resolves when user is successfully logged out
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('✓ User successfully logged out');
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Failed to logout. Please try again.');
  }
};

/**
 * Get current user from Firebase Auth
 * Note: For reactive user state, use onAuthStateChanged in App.tsx instead
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
