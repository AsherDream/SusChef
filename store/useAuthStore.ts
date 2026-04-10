import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout as firebaseLogout } from '../services/api/authService';
import { saveUserProfile, getUserProfile } from '../services/api/userService';
import { usePantryStore } from './usePantryStore';
import { useRecipeStore } from './useRecipeStore';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string;
  emailVerified: boolean;
  allergies: string[];
  pdpaConsent: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
  checkAuthStatus: () => void;
  setLoading: (isLoading: boolean) => void;
  updateProfile: (allergies: string[], pdpaConsent: boolean) => Promise<void>;
  fetchAndSetProfile: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      checkAuthStatus: () => {
        // Auth status checking is handled by Firebase listener in App.tsx
        set({ isLoading: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
      updateProfile: async (allergies: string[], pdpaConsent: boolean) => {
        const { user } = get();
        if (!user) {
          throw new Error('No user logged in. Cannot update profile.');
        }

        try {
          // Update local Zustand state immediately for optimistic UI updates
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  allergies,
                  pdpaConsent,
                }
              : null,
          }));

          // Persist to Firestore for long-term storage
          await saveUserProfile(user.uid, { allergies, pdpaConsent });
        } catch (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
      },
      fetchAndSetProfile: async (userId: string) => {
        try {
          const profile = await getUserProfile(userId);
          if (profile) {
            // Inject fetched Firestore data into existing user object
            set((state) => ({
              user: state.user
                ? {
                    ...state.user,
                    allergies: profile.allergies,
                    pdpaConsent: profile.pdpaConsent,
                  }
                : null,
            }));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Don't throw - silently fail and use local defaults
          // User can still use the app with default values
        }
      },

      logout: async () => {
        try {
          // Call Firebase logout
          await firebaseLogout();

          // Clear auth state
          set({ user: null });

          // Clear pantry data (prevent next user from seeing previous user's ingredients)
          usePantryStore.getState().clearPantry();

          // Clear recipe data (prevent next user from seeing previous user's recipes)
          useRecipeStore.getState().clearRecipes();

          console.log('✓ Auth store cleared, all user data removed');
        } catch (error) {
          console.error('Error during logout:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
