# SusChef Architecture Documentation

**Project:** SusChef - AI-powered recipe recommendation app  
**Platform:** React Native + Expo (iOS/Android/Web)  
**Date:** April 11, 2026  
**Status:** Functional with showcase implementation

---

## 1. High-Level Overview

SusChef is a cross-platform recipe recommendation app that:
- Authenticates users via Firebase Auth
- Stores user preferences (allergies, dietary style) in Firestore
- Manages user pantry (ingredients/kitchen tools) with local + cloud sync
- Generates recipe recommendations using Google Gemini AI
- Allows users to save recipes and browse saved collection

**Data Flow:**
```
User Input (Pantry) → Gemini AI → Recipes → Save to Firestore → Saved Collection
```

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React Native | 0.74.5 |
| **Build** | Expo | 54.0.33 |
| **Language** | TypeScript | 5.1.3 |
| **State Mgmt** | Zustand | 4.5.2 |
| **Navigation** | React Navigation | 6.x |
| **Backend** | Firebase | 12.11.0 |
| **Auth** | Firebase Auth | (built-in) |
| **Database** | Firestore | (built-in) |
| **AI** | Google Gemini | 1.0 Pro / 2.5 Flash |
| **Persistence** | AsyncStorage | 2.2.0 |
| **UI Icons** | Lucide React Native | 0.363.0 |
| **Linting** | ESLint 9.x | Latest |
| **Formatting** | Prettier 3.x | Latest |

---

## 3. Project Structure

```
SusChef/
├── App.tsx (Root component, auth bootstrapping)
├── App.json (Expo config)
├── package.json (Frontend dependencies)
├── tsconfig.json (TypeScript config)
├── metro.config.js (Bundler config)
├── babel.config.js (Babel config)
│
├── navigation/
│   ├── AppNavigator.tsx (Protected routing: Auth → App logic)
│   ├── TabNavigator.tsx (5 main app tabs with nested stacks)
│   ├── routeNames.ts (Route constants)
│   └── types.ts (Navigation param types)
│
├── features/ (Feature-based organization)
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   └── hooks/useAuthForm.ts
│   ├── landing/
│   │   └── LandingPage.tsx
│   ├── pantry/
│   │   └── PantryScreen.tsx (Ingredient/tool management, AI trigger)
│   ├── home/
│   │   ├── HomeScreen.tsx
│   │   └── SavedRecipesScreen.tsx
│   ├── recommendations/
│   │   ├── RecipeResultsScreen.tsx (AI-generated recipes)
│   │   ├── RecipeDetailScreen.tsx (Recipe view + save)
│   │   ├── LoadingScreen.tsx
│   │   └── RecommendationsScreen.tsx
│   ├── profile/
│   │   ├── ProfileScreen.tsx (Preferences, logout)
│   │   └── SettingsDetailScreen.tsx
│   ├── rating/
│   │   └── RatingScreen.tsx
│   └── tools/
│       └── ToolsScreen.tsx
│
├── store/ (Zustand state management)
│   ├── index.ts (Exports)
│   ├── useAuthStore.ts (Auth state + logout)
│   ├── useAppStore.ts (Theme, dietary preferences)
│   ├── usePantryStore.ts (Ingredients + tools, debounced sync)
│   ├── useRecipeStore.ts (Generated + saved recipes, persisted)
│   └── usePantryStore.tsx (Deprecated React Context - DELETE)
│
├── services/
│   ├── api/
│   │   ├── authService.ts (Firebase signOut)
│   │   ├── geminiService.ts (AI recipe generation)
│   │   ├── recipeApiService.ts (Mock API + Firestore bookmarking)
│   │   ├── userService.ts (Profile persistence)
│   │   └── pantryService.ts (Pantry persistence)
│   └── storage/
│       └── storageService.ts
│
├── models/
│   ├── Recipe.ts (Recipe interface)
│   ├── Ingredient.ts (Ingredient interface)
│   ├── Tool.ts (Kitchen tools)
│   └── Rating.ts (Rating model)
│
├── components/ (40+ UI components)
│   ├── RecipeCard.tsx (Horizontal recipe display)
│   ├── Button.tsx (Primary/danger/ghost variants)
│   ├── InputField.tsx (Text input with validation)
│   ├── EmptyState.tsx (Empty state template)
│   ├── TabSwitcher.tsx (Tab toggle)
│   ├── profile/
│   │   ├── AllergyManager.tsx
│   │   ├── AvatarPicker.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── SettingRow.tsx
│   │   └── Others...
│   ├── cookbook/
│   │   ├── GridRecipeCard.tsx
│   │   ├── EmptyCookbook.tsx
│   │   └── CookbookFilter.tsx
│   └── unit-selector/
│       ├── UnitTile.tsx
│       └── UnitCategorySection.tsx
│
├── core/
│   ├── config/
│   │   ├── firebaseConfig.ts (Firebase init + emulator connection)
│   │   └── apiConfig.ts (API endpoints)
│   ├── theme/
│   │   ├── colors.ts (Color palette)
│   │   ├── typography.ts (Font sizes, spacing, radius)
│   │   └── theme.tsx (Theme provider)
│   ├── constants/
│   │   ├── appConstants.ts (Timeouts, categories, keys)
│   │   └── mockRecipes.ts (Mock recipe data)
│   └── utils/
│       ├── ErrorBoundary.tsx (Error boundary)
│       ├── helpers.ts (Utility functions)
│       └── imageHelper.ts (Image handling)
│
├── functions/ (Firebase Cloud Functions - Showcase)
│   ├── src/
│   │   └── index.ts (generateRecipes Cloud Function - can be re-enabled)
│   ├── package.json (Functions dependencies)
│   ├── tsconfig.json (Functions TypeScript config)
│   ├── .env (Local GEMINI_API_KEY)
│   └── .eslintrc.js
│
├── .env (Frontend env - EXPO_PUBLIC_GEMINI_API_KEY)
├── .env.example (Env template)
├── .eslintrc.json (ESLint config)
├── .prettierrc (Prettier config)
├── firebase.json (Firebase config + emulator settings)
├── firestore.rules (Firestore security rules)
├── firestore.indexes.json (Firestore indexes)
└── AUDIT_REPORT.md (Tech debt audit)
```

---

## 4. Core Systems

### 4.1 Authentication System (Firebase Auth)

**Flow:**
```
LoginScreen → authService.login() → Firebase Auth → Store in useAuthStore
    ↓
App.tsx: onAuthStateChanged() listener
    ↓
Auto-hydrate: fetchAndSetProfile() + fetchAndSetPantry()
    ↓
Protected Routes: AppNavigator checks !!user
```

**Key Files:**
- `services/api/authService.ts` - Firebase login/logout
- `store/useAuthStore.ts` - Auth state (user, profile methods)
- `App.tsx` - Firebase listener setup

**Logout Flow:**
```
ProfileScreen.handleLogout() 
    → authService.logout() (Firebase signOut)
    → useAuthStore.clearUser() + clear pantry/recipes
    → navigation.replace(RouteNames.Login) (SECURE - clears history)
    → User cannot swipe back to app
```

---

### 4.2 State Management (Zustand Stores)

| Store | Purpose | Persistence | Key Features |
|-------|---------|-------------|--------------|
| `useAuthStore` | User profile, auth methods | ✅ AsyncStorage | updateProfile, fetchAndSetProfile, logout |
| `usePantryStore` | Ingredients + tools | ❌ Cloud-only | Debounced sync (500ms), optimistic updates |
| `useRecipeStore` | Generated + saved recipes | ✅ AsyncStorage (partialize) | Excludes error/isGenerating from persist |
| `useAppStore` | Theme, dietary preferences | ✅ AsyncStorage | toggleTheme, setDietaryStyle, toggleAllergy |

**Debounce Pattern (usePantryStore):**
```typescript
// Module-level debounce timer
let syncTimeout: NodeJS.Timeout;

// Each mutation resets timer, batches changes
addIngredient() {
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => syncPantryToCloud(userId), 500);
}
```

**Persistence Pattern (useRecipeStore):**
```typescript
persist(
  (set, get) => ({ /* store logic */ }),
  {
    name: 'recipe-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      generatedRecipes: state.generatedRecipes,
      savedRecipes: state.savedRecipes,
      // Excludes: error, isGenerating (transient state)
    })
  }
)
```

---

### 4.3 Navigation Architecture

**Structure:**
```
RootNavigator (AppNavigator.tsx)
├── If !user → AuthNavigator
│   ├── LandingPage
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── ForgotPasswordScreen
└── If user → AppStackNavigator
    └── TabNavigator (5 tabs)
        ├── PantryStackNavigator → PantryScreen
        ├── RecipesStackNavigator → RecipeResultsScreen → RecipeDetailScreen
        ├── SavedStackNavigator → SavedRecipesScreen → RecipeDetailScreen
        ├── ProfileStackNavigator → ProfileScreen → SettingsDetailScreen
        └── (Additional tabs)
```

**Dual-Stack Pattern (Recipes vs Saved):**
- RecipesStackNavigator: For AI-generated recipes
- SavedStackNavigator: For user-saved recipes
- Both navigate to RecipeDetailScreen but stay within their tab
- Prevents unwanted tab switching when viewing details

**Protected Routing:**
```typescript
// App.tsx - Firebase listener
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    // Hydrate + set user
    setUser(userData);
  } else {
    // Clear all stores
    clearUser();
  }
});

// AppNavigator - Conditional rendering
if (isAuthenticated) {
  return <AppStackNavigator />;
} else {
  return <AuthNavigator />; // Auth routes completely removed from memory
}
```

---

### 4.4 AI Integration (Gemini)

**Current Mode:** SHOWCASE (Direct frontend calls)

```typescript
// services/api/geminiService.ts
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

const result = await model.generateContent({
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.7,
    maxOutputTokens: 8192,
  },
});
```

**Trigger Flow:**
```
PantryScreen (Add ingredients)
    ↓
User taps "Generate Recipe" button
    ↓
useRecipeStore.generateRecipes(userId)
    ↓
callGemini(ingredients, allergies)
    ↓
Parse JSON response → Store in generatedRecipes
    ↓
Navigate to RecipeResultsScreen (Recipes tab)
    ↓
Display 3 recipes with save functionality
```

**Error Handling:**
```
try {
  const result = await model.generateContent(...);
  const responseText = result.response.text();
  console.log('🟢 GEMINI RAW RESPONSE:', responseText);
  const recipes = JSON.parse(responseText);
} catch (error) {
  console.error('🚨 CRITICAL BACKEND ERROR:', error);
  // Specific error handling for API limits, auth, etc.
}
```

**Firebase Cloud Function (Alternative - Currently Commented):**
```typescript
// Can be re-enabled for production
const generateRecipesFn = httpsCallable(functions, 'generateRecipes');
const response = await generateRecipesFn({ ingredients, allergies });
```

---

### 4.5 Data Persistence

**Local (AsyncStorage):**
- Auth user state
- Recipe cache (generated + saved)
- App preferences (theme, dietary style)
- Ingredient cache (local-first, synced to cloud)

**cloud (Firestore):**
```
users/{uid}
├── email
├── displayName
├── allergies: string[]
├── pdpaConsent: boolean
├── pantry/
│   └── ingredients: Ingredient[]
│   └── kitchenTools: string[]
└── savedRecipes/
    ├── {recipeId}
    ├── {recipeId}
    └── ...
```

**Sync Strategy:**
- Pantry: Optimistic local + debounced cloud sync (500ms)
- Recipes: Firestore sync on save button click
- User Profile: Direct Firestore save

---

### 4.6 Firebase Configuration

**Setup (firebaseConfig.ts):**
```typescript
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

// Development: Connect to emulator
if (process.env.NODE_ENV === 'development') {
  const functions = getFunctions(app);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

**Firebase Emulator Setup (firebase.json):**
```json
{
  "functions": {
    "source": "functions"
  },
  "emulators": {
    "functions": { "port": 5001 },
    "hosting": { "port": 5000 },
    "ui": { "enabled": true }
  }
}
```

---

## 5. Component Hierarchy

### Key Screens

**PantryScreen:**
- Ingredient list (add/remove/edit amount/unit)
- Kitchen tool toggles
- "Generate Recipe" button (triggers Gemini)
- Loading state during generation

**RecipeResultsScreen:**
- Display generated recipes
- Empty state if none generated
- Loading spinner during generation
- No auto-generation on mount (prevents duplicates)

**RecipeDetailScreen:**
- Recipe lookup: checks generatedRecipes + savedRecipes
- Ingredient list with checkboxes (UI tracking)
- Instructions with tab switcher
- Save/unsave heart button with Firestore sync
- Back button navigates within stack (not tab-switching)

**ProfileScreen:**
- Display user name, email
- Allergy selection grid (checkboxes)
- Dietary style toggle (Vegan/Vegetarian/Keto/Paleo)
- PDPA consent checkbox
- Dark mode toggle
- Log Out button (securely clears history)

**SavedRecipesScreen:**
- Grid of saved recipes
- Filter by category (All/Breakfast/Lunch/Dinner)
- Empty state with message
- Tap to view detail (stays in Saved tab via SavedStackNavigator)

---

## 6. Data Models

```typescript
// models/Recipe.ts
interface Recipe {
  id: string;
  title: string;
  time: number; // minutes
  matchScore: number; // 0-10
  totalItems: number; // ingredient count
  image: string; // URL or null
  ingredients: string[];
  instructions: string[];
  description?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servings?: number;
}

// models/Ingredient.ts
interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  calories?: number;
  category?: string;
}

// models/Tool.ts (Kitchen tools)
// Simple string array stored in pantry
```

---

## 7. API & Service Layer

| Service | Purpose | Method |
|---------|---------|--------|
| `authService.ts` | Firebase auth operations | login, register, logout, resetPassword |
| `geminiService.ts` | AI recipe generation | generateRecipesFromPantry |
| `recipeApiService.ts` | Recipe bookmarking + mock API | toggleSavedRecipe, getSavedRecipes, searchRecipes |
| `userService.ts` | User profile sync | saveUserProfile, getUserProfile |
| `pantryService.ts` | Pantry persistence | saveUserPantry, getUserPantry |
| `storageService.ts` | Local storage helpers | setItem, getItem, removeItem |

---

## 8. Styling & Theme

**Color Palette (colors.ts):**
- Background, surface, primary, secondary
- Status colors: success, error, warning
- Text colors: primary, secondary, disabled

**Typography (typography.ts):**
- Font sizes: xs, sm, base, lg, xl, 2xl
- Font weights: regular, medium, semibold, bold
- Layout: spacing (xs-2xl), radius (sm, md, lg), icon sizes

**Theming:**
```typescript
// useAppStore manages isDarkMode
const colors = useThemeColors(); // Returns theme-aware colors
const { isDarkMode } = useAppStore();
```

---

## 9. Code Quality

**TypeScript:**
- Strict mode: ✅ Yes
- Target: ES2020
- Strict null checks: Enabled
- Compilation errors: 0

**Linting & Formatting:**
- ESLint 9.x configured with React Native rules
- Prettier 3.x configured (2-space tabs, 100-char line width, single quotes)
- Pre-commit hooks via husky + lint-staged (optional)

**Known Tech Debt:**
- No automated test suite (0% coverage)
- Mock recipe API not migrated to real backend
- Cloud Functions implementation available but not active
- Minimal error boundary coverage
- No performance monitoring/analytics

---

## 10. Current State & Session Summary

**Latest Work (April 11, 2026):**
1. ✅ Codebase audit completed (AUDIT_REPORT.md)
2. ✅ ESLint + Prettier configured
3. ✅ JSDoc added to auth store
4. ✅ Gemini API key moved to backend Cloud Function (can be re-enabled)
5. ✅ CORS handling implemented for emulator
6. ✅ Logout navigation fixed (secure replace/reset pattern)
7. ✅ Model switched to gemini-1.0-pro (stable)
8. ✅ TypeScript: 0 compilation errors

**Production Ready Components:**
- Auth system with Firebase
- State management with Zustand
- Protected routing with React Navigation
- Firestore integration for user data
- Gemini AI integration (direct frontend mode for showcase)
- Logout with secure navigation history clearing

**Deployment Status:**
- Firebase: Requires Blaze plan upgrade for Cloud Functions deployment
- Emulator: Fully functional locally with `firebase emulators:start`
- Web/Mobile: Ready to deploy via Expo

---

## 11. Environment Variables

```bash
# .env (Frontend)
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=suschef-27d3f
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...
EXPO_PUBLIC_GEMINI_API_KEY=... (Showcase mode only)

# functions/.env (Backend - local testing)
GEMINI_API_KEY=... (Cloud Function server-side)
```

---

## 12. Quick Reference Commands

```bash
# Development
npx expo start -c                    # Start dev server with cache clear
npx expo start -c --web             # Start web specifically

# Testing
npx tsc --noEmit                     # Check TypeScript
npm run lint                         # Run ESLint
npm run format                       # Format with Prettier
npm run check                        # lint + format

# Functions (if re-enabling Cloud Functions)
cd functions
npm run build                        # Compile TypeScript
firebase emulators:start --clear-on-restart
firebase deploy --only functions    # Deploy to production

# Firebase
firebase init                        # Initialize Firebase project
firebase login                       # Authenticate CLI
firebase emulators:start             # Start all emulators
```

---

## 13. Architecture Decisions & Rationale

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Zustand instead of Redux** | Lightweight, minimal boilerplate | Less middleware ecosystem |
| **Feature-based structure** | Easy to navigate, scale features | More files per feature |
| **Debounced sync (500ms)** | Prevents Firebase race conditions | Slight latency for cloud updates |
| **Dual-stack tabs** | Fixes unwanted tab switching | More navigator instances |
| **AsyncStorage only** | Works on all platforms | No offline-first pattern |
| **Direct Gemini calls (showcase)** | Simple for demo | API key exposed on client |
| **React Navigation v6** | Mature, well-maintained | Learning curve for nested stacks |

---

## Summary

SusChef is a full-featured cross-platform recipe app with:
- ✅ Enterprise-grade auth (Firebase)
- ✅ Real-time sync (Firestore)
- ✅ AI-powered features (Gemini)
- ✅ Type-safe frontend (TypeScript)
- ✅ Clean architecture (feature-based)
- ⚠️ Showcase implementation (API key exposed for demo)
- ⚠️ No test suite (identified in audit)
- ⚠️ Single developer codebase (needs documentation)

**Ready for:** Demo, local development, controlled showcase  
**Next Steps:** Upgrade Firebase to Blaze, add test suite, migrate to production-secure backend
