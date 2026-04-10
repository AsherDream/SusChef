import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PantrySection } from '../../components/PantrySection';
import { IngredientListItem } from '../../components/IngredientListItem';
import { ToolRow } from '../../components/ToolRow';
import { Button } from '../../components/Button';
import { LoadingScreen } from '../recommendations/LoadingScreen';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';
import { RouteNames } from '../../navigation/routeNames';
import { PantryStackParamList } from '../../navigation/types';
import { usePantryStore, type Ingredient } from '../../store/usePantryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useRecipeStore } from '../../store/useRecipeStore';
import { APP_CONSTANTS } from '../../core/constants/appConstants';
import { Tool } from '../../models/Tool';

type PantryScreenProps = NativeStackScreenProps<
  PantryStackParamList,
  typeof RouteNames.PantryScreen
>;

// Move styles outside component to prevent recreation on every render
const createStyles = () =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    headerSection: {
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.lg,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    header: {
      fontSize: typography.size.h2,
      fontWeight: '700' as const,
      color: colors.primary,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: layout.spacing.lg,
      justifyContent: 'flex-start',
    },
    sectionsRow: {
      flex: 1,
      flexDirection: 'column' as const,
      justifyContent: 'flex-start',
    },
    ingredientsSection: {
      flex: 1.5,
    },
    toolsSection: {
      flex: 1,
    },
    footerContainer: {
      paddingVertical: layout.spacing.lg,
      paddingHorizontal: layout.spacing.lg,
      alignItems: 'center',
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    buttonWrapper: {
      width: '65%',
      alignSelf: 'center',
    },
  });

const styles = createStyles();

export const PantryScreen: React.FC<PantryScreenProps> = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);

  // Get state from Zustand stores
  const { user } = useAuthStore();
  const {
    ingredients,
    kitchenTools,
    addIngredient,
    removeIngredient,
    updateIngredientAmount,
    updateIngredientUnit,
    toggleKitchenTool,
    syncPantryToCloud,
  } = usePantryStore();

  // Helper function to convert kitchenTools array to Tool objects for the ToolRow
  const toolsArray: Tool[] = useMemo(() => {
    // Define all available kitchen tools
    const allTools = [
      { id: 't1', name: 'Microwave' },
      { id: 't2', name: 'Oven' },
      { id: 't3', name: 'Blender' },
      { id: 't4', name: 'Stovetop' },
      { id: 't5', name: 'Grill' },
    ];

    // Map to include isChecked status from kitchenTools array
    return allTools
      .map((tool) => ({
        ...tool,
        isChecked: kitchenTools.includes(tool.name),
      }))
      .sort((a, b) => {
        if (a.isChecked === b.isChecked) return 0;
        return a.isChecked ? -1 : 1;
      });
  }, [kitchenTools]);

  const handleAddIngredient = useCallback(
    async (name: string) => {
      if (name.trim()) {
        try {
          await addIngredient(name, 1, 'pcs');
          // Sync will happen via useEffect
        } catch (error) {
          Alert.alert('Error', 'Failed to add ingredient. Please try again.');
        }
      }
    },
    [addIngredient]
  );

  const handleAddTool = useCallback(
    async (name: string) => {
      if (name.trim()) {
        try {
          await toggleKitchenTool(name.trim());
          // Sync will happen via useEffect
        } catch (error) {
          Alert.alert('Error', 'Failed to add tool. Please try again.');
        }
      }
    },
    [toggleKitchenTool]
  );

  const handleDeleteIngredient = useCallback(
    async (id: string) => {
      const ingredient = ingredients.find((ing) => ing.id === id);
      if (!ingredient) return;

      // Show confirmation alert
      Alert.alert('Remove Item?', `Are you sure you want to remove "${ingredient.name}"?`, [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await removeIngredient(id);
              // Sync will happen via useEffect
            } catch (error) {
              Alert.alert('Error', 'Failed to remove ingredient. Please try again.');
            }
          },
          style: 'destructive',
        },
      ]);
    },
    [ingredients, removeIngredient]
  );

  const handleToggleTool = useCallback(
    async (toolId: string) => {
      try {
        const tool = toolsArray.find((t) => t.id === toolId);
        if (tool) {
          await toggleKitchenTool(tool.name);
          // Sync will happen via useEffect
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update tool. Please try again.');
      }
    },
    [toolsArray, toggleKitchenTool]
  );

  const handleUpdateIngredientAmount = useCallback(
    async (id: string, newAmount: number) => {
      try {
        // Parse as number and validate
        const parsedAmount = typeof newAmount === 'string' ? parseFloat(newAmount) : newAmount;
        if (!isNaN(parsedAmount) && parsedAmount >= 0) {
          await updateIngredientAmount(id, parsedAmount);
          // Sync will happen via useEffect
        } else {
          Alert.alert('Invalid Amount', 'Please enter a valid number.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update ingredient amount. Please try again.');
      }
    },
    [updateIngredientAmount]
  );

  const handleUpdateIngredientUnit = useCallback(
    async (id: string, newUnit: string) => {
      try {
        if (newUnit.trim()) {
          await updateIngredientUnit(id, newUnit);
          // Sync will happen via useEffect
        } else {
          Alert.alert('Invalid Unit', 'Please enter a valid unit.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update ingredient unit. Please try again.');
      }
    },
    [updateIngredientUnit]
  );

  const handleGenerateRecipe = useCallback(() => {
    if (ingredients.length === 0) {
      Alert.alert('No Ingredients', 'Please add some ingredients to generate a recipe.');
      return;
    }

    setIsLoading(true);

    // Trigger AI recipe generation
    const generateAndNavigate = async () => {
      try {
        await useRecipeStore.getState().generateRecipes(user?.uid || '');
      } catch (error) {
        console.error('Error generating recipes:', error);
        Alert.alert('Generation Failed', 'Failed to generate recipes. Please try again.');
        setIsLoading(false);
        return;
      }

      // Simulate AI processing
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to recipes results
        navigation?.navigate(RouteNames.Recipes as any);
      }, APP_CONSTANTS.RECIPE_GENERATION_DELAY);
    };

    generateAndNavigate();
  }, [ingredients.length, navigation, user?.uid]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.headerSection}>
                <Text style={styles.header}>Pantry</Text>
              </View>

              {/* Content */}
              <View style={styles.contentContainer}>
                <View style={styles.sectionsRow}>
                  {/* Ingredients Section */}
                  <View style={styles.ingredientsSection}>
                    <PantrySection
                      title="INGREDIENTS"
                      placeholder="+ Add ingredient..."
                      data={ingredients}
                      onAddItem={handleAddIngredient}
                      flex={1}
                      showsVerticalScrollIndicator={true}
                      renderItem={(item: Ingredient) => (
                        <IngredientListItem
                          item={item}
                          onDelete={() => handleDeleteIngredient(item.id)}
                          onAmountChange={(id, amount) => handleUpdateIngredientAmount(id, amount)}
                          onUnitChange={(id, unit) => handleUpdateIngredientUnit(id, unit)}
                        />
                      )}
                    />
                  </View>

                  {/* Tools Section */}
                  <View style={styles.toolsSection}>
                    <PantrySection
                      title="KITCHEN TOOLS"
                      placeholder="+ Add tool..."
                      data={toolsArray}
                      onAddItem={handleAddTool}
                      flex={1}
                      showsVerticalScrollIndicator={true}
                      renderItem={(item: Tool) => (
                        <ToolRow
                          label={item.name}
                          initialChecked={item.isChecked}
                          onToggle={() => handleToggleTool(item.id)}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>

              {/* Footer Button */}
              <View style={styles.footerContainer}>
                <View style={styles.buttonWrapper}>
                  <Button
                    text="Generate Recipe"
                    onPress={handleGenerateRecipe}
                    variant="primary"
                    size="lg"
                    icon={<Sparkles size={20} stroke={colors.surface} strokeWidth={2} />}
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </>
  );
};

export default PantryScreen;
