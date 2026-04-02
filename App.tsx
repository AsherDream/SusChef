import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ErrorBoundary } from './core/utils/ErrorBoundary';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from './core/theme/theme';
import { useAuthStore } from './store/useAuthStore';
import { PantryProvider } from './store/usePantryStore';
import { auth } from './core/config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';


console.log('AppNavigator:', typeof AppNavigator);
console.log('ThemeProvider:', typeof ThemeProvider);
console.log('ErrorBoundary:', typeof ErrorBoundary);
console.log('SafeAreaProvider:', typeof SafeAreaProvider);


export default function App() {
  const { setUser, checkAuthStatus, fetchAndSetProfile } = useAuthStore();

  // Initialize Firebase Auth listener
  useEffect(() => {
    // Check auth on app start
    checkAuthStatus();

    // Only set up listener if auth is properly initialized
    if (!auth) {
      console.warn('Firebase auth not initialized');
      return;
    }

    // Set up listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || undefined, // Required for Social Auth
          emailVerified: user.emailVerified,           // Required for Security Gate
          allergies: [],                               // Initialize empty allergy list
          pdpaConsent: false,                          // Default consent to false
        });

        // Fetch user profile data from Firestore (allergies, consent)
        try {
          await fetchAndSetProfile(user.uid);
        } catch (error) {
          console.warn('Failed to fetch user profile from Firestore:', error);
          // Continue with defaults if fetch fails
        }
      } else {
        // Clear user state on logout or session expiry (security fix)
        const { clearUser } = useAuthStore.getState();
        clearUser();
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [setUser, checkAuthStatus, fetchAndSetProfile]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SafeAreaProvider>
          <PantryProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </PantryProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
