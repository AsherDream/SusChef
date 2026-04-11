import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GridRecipeCard } from '../../components/cookbook/GridRecipeCard';
import { CookbookFilter } from '../../components/cookbook/CookbookFilter';
import { EmptyCookbook } from '../../components/cookbook/EmptyCookbook';
import { useThemeColors } from '../../core/theme/theme';
import { layout, typography } from '../../core/theme/typography';
import { RouteNames } from '../../navigation/routeNames';
import { useRecipeStore } from '../../store/useRecipeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Recipe } from '../../models/Recipe';
import { APP_CONSTANTS } from '../../core/constants/appConstants';

interface SavedRecipesScreenProps {
  navigation?: any;
}

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner'];

// Move styles outside component
const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerSection: {
      paddingHorizontal: layout.spacing.lg,
      paddingVertical: layout.spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },
    header: {
      fontSize: typography.size.h2,
      fontWeight: '700' as const,
      color: colors.text.primary,
    },
    flatList: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: layout.spacing.lg,
      paddingTop: layout.spacing.lg,
      paddingBottom: layout.spacing.xl,
    },
    columnWrapper: {
      justifyContent: 'space-between',
      marginBottom: layout.spacing.lg,
      gap: layout.spacing.sm,
    },
    cardWrapper: {
      width: '48%',
    },
  });

// Helper to categorize recipes based on recipe IDs
const RECIPE_CATEGORIES: { [key: string]: string[] } = {
  Breakfast: ['1'],
  Lunch: ['2', '3'],
  Dinner: ['1', '2'],
};

/**
 * Filter recipes by category
 */
const filterRecipesByCategory = (recipes: Recipe[], category: string | null): Recipe[] => {
  if (!category || category === 'All') {
    return recipes;
  }
  return recipes.filter((recipe: Recipe) => RECIPE_CATEGORIES[category]?.includes(recipe.id));
};

export const SavedRecipesScreen: React.FC<SavedRecipesScreenProps> = ({ navigation }) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const { user } = useAuthStore();
  const { savedRecipes, toggleSave, isRecipeSaved } = useRecipeStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Memoize filtered recipes to prevent unnecessary recalculations
  const filteredRecipes = useMemo(
    () => filterRecipesByCategory(savedRecipes, selectedCategory),
    [savedRecipes, selectedCategory]
  );

  const handleRemoveRecipe = useCallback(
    async (recipe: Recipe) => {
      if (user?.uid) {
        await toggleSave(user.uid, recipe);
      }
    },
    [toggleSave, user?.uid]
  );

  const handleRecipePress = useCallback(
    (recipeId: string) => {
      navigation?.navigate(RouteNames.RecipeDetail, { recipeId });
    },
    [navigation]
  );

  const handleNavigateToPantry = useCallback(() => {
    navigation?.navigate(RouteNames.Pantry);
  }, [navigation]);

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <View style={styles.cardWrapper}>
      <GridRecipeCard
        title={item.title}
        image={item.image}
        time={item.time}
        isSaved={isRecipeSaved(item.id)}
        onPress={() => handleRecipePress(item.id)}
        onToggleSave={() => handleRemoveRecipe(item)}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <EmptyCookbook onNavigateToPantry={handleNavigateToPantry} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.header}>My Cookbook</Text>
        </View>

        {/* Filter Bar */}
        {savedRecipes.length > 0 && (
          <CookbookFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}

        {/* Main Content - FlatList with Grid */}
        <FlatList
          style={styles.flatList}
          data={filteredRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </SafeAreaView>
  );
};

export default SavedRecipesScreen;
