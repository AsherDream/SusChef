import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

// Firebase configuration
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
  // For Expo web, getAuth handles persistence automatically via localStorage
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase');
}

export { app, auth };
