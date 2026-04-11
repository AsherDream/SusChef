import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration - using environment variables with fallbacks
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);

  // Initialize auth with AsyncStorage persistence for React Native (Expo)
  // This ensures users stay logged in across app restarts on both mobile and web
  try {
    // Dynamically import getReactNativePersistence to handle both web and native environments
    const { getReactNativePersistence } = require('firebase/auth/react-native');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
    console.log('Firebase Auth initialized with AsyncStorage persistence');
  } catch (e) {
    // Fallback: If React Native persistence is not available, use getAuth
    // This handles edge cases and ensures web builds work without the react-native module
    auth = getAuth(app);
    console.log('Firebase Auth initialized with default persistence');
  }

  // Initialize Firestore
  db = getFirestore(app);
  console.log('Firebase Firestore initialized');

  // Connect to local emulator during development
  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined'
  ) {
    const functions = getFunctions(app);
    try {
      connectFunctionsEmulator(functions, 'localhost', 5001);
      console.log('🔌 Connected to Firebase Functions Emulator on port 5001');
    } catch (error) {
      // Emulator already connected or unavailable - not a critical error
      console.debug('Functions emulator connection info:', error);
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Check your configuration.');
}

export { app, auth, db };
