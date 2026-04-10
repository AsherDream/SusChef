import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Clock, Star } from 'lucide-react-native';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';
import { Recipe } from '../models/Recipe';
import { getRecipeImageWithFallback } from '../core/utils/imageHelper';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

// Move styles outside component to prevent recreation on every render
const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row' as const,
      height: 128,
      backgroundColor: colors.surface,
      borderRadius: layout.radius.lg,
      overflow: 'hidden' as const,
      marginBottom: layout.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    image: {
      width: 128,
      height: 128,
      backgroundColor: '#E0E0E0',
    },
    imageContainer: {
      width: 128,
      height: 128,
      backgroundColor: '#E0E0E0',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingIndicator: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: 'transparent',
      borderTopColor: colors.primary,
      borderRightColor: colors.primary,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.md,
      justifyContent: 'space-between' as const,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: typography.size.h2,
      fontWeight: '700' as const,
      color: colors.text.primary,
    },
    metadataRow: {
      flexDirection: 'row' as const,
      gap: layout.spacing.lg,
      alignItems: 'center' as const,
    },
    metadata: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: layout.spacing.sm,
    },
    metadataText: {
      fontSize: typography.size.caption,
      color: colors.text.secondary,
      fontWeight: '500' as const,
    },
    badgeContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 4,
      backgroundColor: '#FFF3CD',
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: 4,
      borderRadius: layout.radius.full,
    },
    badgeText: {
      fontSize: typography.size.caption,
      color: '#F59E0B',
      fontWeight: '600' as const,
    },
  });

const styles = createStyles();

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getRecipeImageWithFallback(recipe.image, recipe.title) }}
          style={styles.image}
          contentFit="cover"
          transition={1000}
          onLoad={handleImageLoad}
        />
        {isImageLoading && <View style={styles.loadingIndicator} />}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
        </View>
        <View style={styles.metadataRow}>
          <View style={styles.metadata}>
            <Clock size={16} color={colors.text.secondary} />
            <Text style={styles.metadataText}>{recipe.time}m</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.badgeText}>
              {recipe.matchScore}/{recipe.totalItems}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
