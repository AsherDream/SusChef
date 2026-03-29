import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from './routeNames';
import { RootStackParamList } from './types'; 
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen.tsx';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    // Note: No <NavigationContainer> here! It's already in App.tsx.
    <Stack.Navigator
      initialRouteName={RouteNames.Login}
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* 1. Login Screen (Stack Level) */}
      <Stack.Screen
        name={RouteNames.Login}
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={RouteNames.Register}
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      {/* 2. The Main App (Tab Level) */}
      <Stack.Screen
        name={RouteNames.MainApp} 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}