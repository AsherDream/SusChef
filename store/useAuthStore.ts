import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  updateProfile: (allergies: string[], pdpaConsent: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      checkAuthStatus: () => {
        // Auth status checking is handled by Firebase listener in App.tsx
        set({ isLoading: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
      updateProfile: (allergies: string[], pdpaConsent: boolean) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                allergies,
                pdpaConsent,
              }
            : null,
        }));
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
