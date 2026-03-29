import React, { useState, useCallback, useMemo } from 'react';
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
import { TabParamList } from '../../navigation/types';
import { usePantryStore, Ingredient } from '../../store';
import { APP_CONSTANTS } from '../../core/constants/appConstants';
import { Tool } from '../../models/Tool';

type PantryScreenProps = NativeStackScreenProps<TabParamList, typeof RouteNames.Pantry>;

// Move styles outside component to prevent recreation on every render
const createStyles = () => StyleSheet.create({
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

  // Get pantry context with state and actions
  const { state, addIngredient, removeIngredient, updateIngredient } = usePantryStore();
  const ingredients = state.ingredients;

  const [tools, setTools] = useState<Tool[]>([
    { id: 't1', name: 'Microwave', isChecked: true },
    { id: 't2', name: 'Oven', isChecked: false },
    { id: 't3', name: 'Blender', isChecked: true },
  ]);

  // Memoize sorted tools to prevent unnecessary recreations
  const sortedTools = useMemo(() => {
    return [...tools].sort((a: Tool, b: Tool) => {
      if (a.isChecked === b.isChecked) return 0;
      return a.isChecked ? -1 : 1;
    });
  }, [tools]);

  const handleAddIngredient = useCallback((name: string) => {
    if (name.trim()) {
      addIngredient(name);
    }
  }, [addIngredient]);

  const handleAddTool = useCallback((name: string) => {
    if (name.trim()) {
      setTools((prev) => {
        const newTool: Tool = {
          id: `t${Date.now()}`,
          name: name.trim(),
          isChecked: true,
        };
        const updated = [...prev, newTool];
        return updated.sort((a, b) => {
          if (a.isChecked === b.isChecked) return 0;
          return a.isChecked ? -1 : 1;
        });
      });
    }
  }, []);

  const handleDeleteIngredient = useCallback((id: string) => {
    const ingredient = ingredients.find((ing) => ing.id === id);
    if (!ingredient) return;

    // Explicit check for amount value
    if (ingredient.amount > 0) {
      // Just set to 0
      updateIngredient(id, { amount: 0 });
    } else {
      // Show confirmation alert
      Alert.alert(
        'Remove Item?',
        `Are you sure you want to remove "${ingredient.name}"?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              removeIngredient(id);
            },
            style: 'destructive',
          },
        ]
      );
    }
  }, [ingredients, updateIngredient, removeIngredient]);

  const handleToggleTool = useCallback((id: string) => {
    setTools((prev: Tool[]) => {
      const updated = prev.map((tool: Tool) =>
        tool.id === id ? { ...tool, isChecked: !tool.isChecked } : tool
      );
      // Re-sort immediately
      return updated.sort((a: Tool, b: Tool) => {
        if (a.isChecked === b.isChecked) return 0;
        return a.isChecked ? -1 : 1;
      });
    });
  }, []);

  const handleGenerateRecipe = useCallback(() => {
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to recipes results
      navigation?.navigate(RouteNames.RecipeResults);
    }, APP_CONSTANTS.RECIPE_GENERATION_DELAY);
  }, [navigation]);

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
                          onAmountChange={(id, amount) => {
                            updateIngredient(id, { amount });
                          }}
                          onUnitChange={(id, unit) => {
                            updateIngredient(id, { unit });
                          }}
                        />
                      )}
                    />
                  </View>

                  {/* Tools Section */}
                  <View style={styles.toolsSection}>
                    <PantrySection
                      title="KITCHEN TOOLS"
                      placeholder="+ Add tool..."
                      data={sortedTools}
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
                    icon={
                      <Sparkles
                        size={20}
                        stroke={colors.surface}
                        strokeWidth={2}
                      />
                    }
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
