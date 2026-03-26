import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from './routeNames';
import { RootStackParamList } from './types'; 
import { LandingPage } from '../features/landing/LandingPage';
import LoginScreen from '../features/auth/LoginScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    // Note: No <NavigationContainer> here! It's already in App.tsx.
    <Stack.Navigator
      initialRouteName={RouteNames.Landing}
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* 1. Landing Screen (Onboarding) */}
      <Stack.Screen
        name={RouteNames.Landing}
        component={LandingPage}
        options={{ headerShown: false }}
      />

      {/* 2. Login Screen (Authentication) */}
      <Stack.Screen
        name={RouteNames.Login}
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* 3. The Main App (Tab Level) */}
      <Stack.Screen
        name={RouteNames.MainApp} 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}