import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from '../../components/RecipeCard';
import { Button } from '../../components/Button';
import { useRecipeStore } from '../../store/useRecipeStore';
import { useThemeColors } from '../../core/theme/theme';
import { layout, typography } from '../../core/theme/typography';

interface RecipeResultsScreenProps {
  navigation: any;
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.spacing.lg,
      paddingVertical: layout.spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      marginRight: layout.spacing.md,
    },
    title: {
      fontSize: typography.size.h2,
      fontWeight: '700' as const,
      color: colors.text.primary,
      flex: 1,
    },
    content: {
      paddingHorizontal: layout.spacing.lg,
      paddingTop: layout.spacing.lg,
      paddingBottom: layout.spacing.xl,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: layout.spacing.xl,
    },
    loadingText: {
      fontSize: typography.size.body,
      color: colors.text.secondary,
      marginTop: layout.spacing.md,
      textAlign: 'center',
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: layout.spacing.xl,
    },
    emptyStateText: {
      fontSize: typography.size.body,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: layout.spacing.lg,
      paddingHorizontal: layout.spacing.lg,
    },
    errorContainer: {
      paddingHorizontal: layout.spacing.lg,
      paddingVertical: layout.spacing.md,
      marginTop: layout.spacing.lg,
      backgroundColor: colors.status.error + '1A',
      borderRadius: layout.radius.md,
      borderLeftWidth: 4,
      borderLeftColor: colors.status.error,
    },
    errorText: {
      fontSize: typography.size.body,
      color: colors.status.error,
      fontWeight: '600' as const,
    },
  });

export const RecipeResultsScreen: React.FC<RecipeResultsScreenProps> = ({ navigation }) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const { generatedRecipes, isGenerating, error, clearRecipes } = useRecipeStore();

  // Clear ghost error state on mount if no recipes exist
  React.useEffect(() => {
    if (generatedRecipes.length === 0 && error) {
      clearRecipes();
    }
  }, []);

  const handleRecipePress = useCallback(
    (recipeId: string) => {
      navigation.navigate('RecipeDetail', { recipeId });
    },
    [navigation]
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleGoToPantry = useCallback(() => {
    navigation.navigate('Pantry');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>Recommended for You</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Loading State */}
        {isGenerating && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chef Gemini is thinking...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isGenerating && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}

        {/* Generated Recipes */}
        {!isGenerating && generatedRecipes.length > 0 ? (
          generatedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => handleRecipePress(recipe.id)}
            />
          ))
        ) : !isGenerating ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No recipes generated yet! Head over to your Pantry, select your ingredients, and let
              Chef Gemini cook something up.
            </Text>
            <Button text="Go to Pantry" onPress={handleGoToPantry} variant="primary" />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};
