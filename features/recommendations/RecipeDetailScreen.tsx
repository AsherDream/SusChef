import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabSwitcher } from '../../components/TabSwitcher';
import { IngredientItem } from '../../components/IngredientItem';
import { InstructionStep } from '../../components/InstructionStep';
import { useThemeColors } from '../../core/theme/theme';
import { layout, typography } from '../../core/theme/typography';
import { getRecipeImage } from '../../core/utils/imageHelper';
import { useRecipeStore } from '../../store/useRecipeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { recipeApiService } from '../../services/api/recipeApiService';
import { Recipe } from '../../models/Recipe';

interface RecipeDetailScreenProps {
  navigation: any;
  route: any;
}

// Move styles outside component
const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    imageContainer: {
      position: 'relative',
      height: 288,
      backgroundColor: colors.border,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    backButton: {
      position: 'absolute',
      top: layout.spacing.md,
      left: layout.spacing.md,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.surface}E6`,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    contentContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: layout.radius.lg,
      borderTopRightRadius: layout.radius.lg,
      marginTop: -24,
      paddingHorizontal: layout.spacing.lg,
      paddingTop: layout.spacing.xl,
      paddingBottom: layout.spacing.xl,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.md,
    },
    title: {
      fontSize: typography.size.h1,
      fontWeight: '700' as const,
      color: colors.text.primary,
      flex: 1,
      marginRight: layout.spacing.md,
    },
    heartButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    metadata: {
      flexDirection: 'row',
      gap: layout.spacing.lg,
      marginBottom: layout.spacing.lg,
      paddingBottom: layout.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    metadataItem: {
      flexDirection: 'column',
      gap: 4,
    },
    metadataLabel: {
      fontSize: typography.size.caption,
      color: colors.text.secondary,
      textTransform: 'uppercase',
      fontWeight: '600' as const,
    },
    metadataValue: {
      fontSize: typography.size.body,
      color: colors.text.primary,
      fontWeight: '700' as const,
    },
    ingredientsList: {
      gap: layout.spacing.sm,
    },
    instructionsList: {
      gap: layout.spacing.sm,
    },
  });

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ navigation, route }) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const recipeId = route.params?.recipeId;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);

  const { user } = useAuthStore();
  const { savedRecipes, toggleSave } = useRecipeStore();

  useEffect(() => {
    let isMounted = true;

    const loadRecipe = async () => {
      setIsLoadingRecipe(true);

      // Check both AI-generated and saved recipes locally
      const state = useRecipeStore.getState();
      const localRecipe =
        state.generatedRecipes.find((r) => r.id === recipeId) ||
        state.savedRecipes.find((r) => r.id === recipeId);

      if (localRecipe) {
        if (isMounted) {
          setRecipe(localRecipe);
          setIsLoadingRecipe(false);
        }
        return;
      }

      try {
        const fallbackRecipe = await recipeApiService.getRecipeById(recipeId);
        if (isMounted) {
          setRecipe(fallbackRecipe);
        }
      } catch (error) {
        if (isMounted) {
          setRecipe(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecipe(false);
        }
      }
    };

    loadRecipe();

    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  const isSaved = recipe ? savedRecipes.some((r) => r.id === recipe.id) : false;

  const handleSavePress = async () => {
    if (!recipe || !user?.uid) {
      console.log('Cannot save: recipe or user not available');
      return;
    }

    setIsSavingRecipe(true);
    try {
      await toggleSave(user.uid, recipe);
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setIsSavingRecipe(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const toggleIngredient = (ingredient: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredient)) {
      newChecked.delete(ingredient);
    } else {
      newChecked.add(ingredient);
    }
    setCheckedIngredients(newChecked);
  };

  if (isLoadingRecipe) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getRecipeImage(recipe.image) }}
            style={styles.image}
            resizeMode="cover"
          />
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </Pressable>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Title & Save Button */}
          <View style={styles.headerContent}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Pressable
              style={styles.heartButton}
              onPress={handleSavePress}
              disabled={isSavingRecipe}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart
                size={24}
                color={isSaved ? '#E63946' : colors.text.secondary}
                fill={isSaved ? '#E63946' : 'none'}
              />
            </Pressable>
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Time</Text>
              <Text style={styles.metadataValue}>{recipe.time} mins</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Difficulty</Text>
              <Text style={styles.metadataValue}>{recipe.difficulty}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Servings</Text>
              <Text style={styles.metadataValue}>{recipe.servings}</Text>
            </View>
          </View>

          {/* Tab Switcher */}
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content */}
          {activeTab === 'ingredients' ? (
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <IngredientItem
                  key={`${ingredient}-${index}`}
                  name={ingredient}
                  checked={checkedIngredients.has(ingredient)}
                  onPress={() => toggleIngredient(ingredient)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.instructionsList}>
              {recipe.instructions.map((instruction: string, index: number) => (
                <InstructionStep
                  key={`${index}`}
                  stepNumber={index + 1}
                  instruction={instruction}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
