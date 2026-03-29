import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration - using environment variables with fallbacks
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-bucket.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'demo-app-id',
};

// Initialize Firebase App
let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);

  // For Web (Expo Web), use getAuth which handles persistence via localStorage
  // For Mobile (native), we need to use initializeAuth with AsyncStorage persistence
  try {
    // Try to use initializeAuth with React Native persistence (works on both web and mobile via Expo)
    const { getReactNativePersistence } = require('firebase/auth/react-native');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
    console.log('Firebase Auth initialized with AsyncStorage persistence');
  } catch (e) {
    // Fallback: If React Native persistence is not available, use getAuth
    // This ensures web builds work without the react-native module
    auth = getAuth(app);
    console.log('Firebase Auth initialized with default persistence');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Check your configuration.');
}

export { app, auth };
