import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from './routeNames';
import { RootStackParamList } from './types'; 
import { LandingPage } from '../features/landing/LandingPage';
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import ForgotPasswordScreen from '../features/auth/ForgotPasswordScreen';
import TabNavigator from './TabNavigator';
import { useAuthStore } from '../store/useAuthStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Auth Navigator - Screens shown to unauthenticated users
 * Includes: Landing, Login, Sign Up, Forgot Password
 */
function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={RouteNames.Landing}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={RouteNames.Landing}
        component={LandingPage}
      />
      <Stack.Screen
        name={RouteNames.Login}
        component={LoginScreen}
      />
      <Stack.Screen
        name={RouteNames.Register}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={RouteNames.ForgotPassword}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}

/**
 * App Navigator - Screens shown to authenticated users
 * Includes: Main app tabs, settings, etc
 */
function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={RouteNames.MainApp}
        component={TabNavigator}
      />
    </Stack.Navigator>
  );
}

/**
 * Root Navigator - Protected routing that conditionally renders
 * Auth Navigator or App Navigator based on authentication state
 */
export default function RootNavigator() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  return isAuthenticated ? <AppStackNavigator /> : <AuthNavigator />;
}