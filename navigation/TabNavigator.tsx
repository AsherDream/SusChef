import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Refrigerator, Heart, User, Utensils } from 'lucide-react-native';
import PantryScreen from '../features/pantry/PantryScreen';
import { SavedRecipesScreen } from '../features/home/SavedRecipesScreen';
import { RecipeResultsScreen } from '../features/recommendations/RecipeResultsScreen';
import { RecipeDetailScreen } from '../features/recommendations/RecipeDetailScreen';
import { RouteNames } from './routeNames';
import { TabParamList, PantryStackParamList, ProfileStackParamList, RecipesStackParamList, SavedStackParamList } from './types';
import { colors } from '../core/theme/colors';
import { typography } from '../core/theme/typography';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { SettingsDetailScreen } from '../features/profile/SettingsDetailScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const PantryStack = createNativeStackNavigator<PantryStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const RecipesStack = createNativeStackNavigator<RecipesStackParamList>();
const SavedStack = createNativeStackNavigator<SavedStackParamList>();

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 4,
    paddingTop: 4,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }
      : {
          elevation: 8,
        }),
  },
});

// Nested Stack for Pantry
function PantryStackNavigator() {
  return (
    <PantryStack.Navigator screenOptions={{ headerShown: false }}>
      <PantryStack.Screen
        name={RouteNames.PantryScreen}
        component={PantryScreen}
      />
    </PantryStack.Navigator>
  );
}

// Nested Stack for Recipes
function RecipesStackNavigator() {
  return (
    <RecipesStack.Navigator screenOptions={{ headerShown: false }}>
      <RecipesStack.Screen
        name={RouteNames.RecipeResultsScreen}
        component={RecipeResultsScreen}
      />
      <RecipesStack.Screen
        name={RouteNames.RecipeDetail}
        component={RecipeDetailScreen}
      />
    </RecipesStack.Navigator>
  );
}

// Nested Stack for Saved Recipes
function SavedStackNavigator() {
  return (
    <SavedStack.Navigator screenOptions={{ headerShown: false }}>
      <SavedStack.Screen
        name={RouteNames.Saved}
        component={SavedRecipesScreen}
      />
      <SavedStack.Screen
        name={RouteNames.RecipeDetail}
        component={RecipeDetailScreen}
      />
    </SavedStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name={RouteNames.ProfileScreen} component={ProfileScreen} />
      <ProfileStack.Screen name={RouteNames.SettingsDetail} component={SettingsDetailScreen} />
    </ProfileStack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      id="MainTabs"
      initialRouteName={RouteNames.Pantry}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginBottom: 2,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name={RouteNames.Pantry}
        component={PantryStackNavigator}
        options={{
          tabBarLabel: 'Pantry',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Refrigerator size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={RouteNames.Recipes}
        component={RecipesStackNavigator}
        options={{
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Utensils size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={RouteNames.Saved}
        component={SavedStackNavigator}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={RouteNames.Profile}
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
