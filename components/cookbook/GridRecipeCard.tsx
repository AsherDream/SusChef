import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Clock } from 'lucide-react-native';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';
import { getRecipeImageWithFallback } from '../../core/utils/imageHelper';

interface GridRecipeCardProps {
  title: string;
  image: string;
  time: number;
  isSaved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
}

export const GridRecipeCard: React.FC<GridRecipeCardProps> = ({
  title,
  image,
  time,
  isSaved,
  onPress,
  onToggleSave,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect((): void => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSaved]);

  const handleToggleSave = () => {
    onToggleSave();
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: layout.radius.md,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 140,
      backgroundColor: '#E0E0E0',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: layout.radius.md,
    },
    loadingSpinner: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: 'transparent',
      borderTopColor: colors.primary,
      borderRightColor: colors.primary,
    },
    heartButton: {
      position: 'absolute',
      top: layout.spacing.sm,
      right: layout.spacing.sm,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    heart: {
      transform: [{ scale: scaleAnim }],
    },
    content: {
      padding: layout.spacing.sm,
      gap: layout.spacing.xs,
    },
    title: {
      fontSize: typography.size.body,
      fontWeight: '600' as const,
      color: colors.text.primary,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.xs,
    },
    timeText: {
      fontSize: typography.size.caption,
      color: colors.text.secondary,
      fontWeight: '500' as const,
    },
  });

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getRecipeImageWithFallback(image, title) }}
          style={styles.image}
          contentFit="cover"
          transition={1000}
          onLoad={() => setIsImageLoading(false)}
        />
        {isImageLoading && <View style={styles.loadingSpinner} />}
        <Pressable
          style={styles.heartButton}
          onPress={handleToggleSave}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Animated.View style={styles.heart}>
            <Heart
              size={20}
              color={isSaved ? colors.secondary : colors.text.disabled}
              fill={isSaved ? colors.secondary : 'none'}
              strokeWidth={2}
            />
          </Animated.View>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.timeContainer}>
          <Clock size={14} color={colors.text.secondary} strokeWidth={2} />
          <Text style={styles.timeText}>{time} min</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default GridRecipeCard;
