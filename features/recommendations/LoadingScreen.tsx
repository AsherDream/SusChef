import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ChefHat } from 'lucide-react-native';
import { useThemeColors } from '../../core/theme/theme';
import { typography } from '../../core/theme/typography';

export const LoadingScreen: React.FC = () => {
  const colors = useThemeColors();
  const rotationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotationValue]);

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circleContainer: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    },
    icon: {
      width: 80,
      height: 80,
    },
    text: {
      fontSize: typography.size.h2,
      fontWeight: '700' as const,
      color: colors.text.primary,
      marginTop: 24,
    },
    subText: {
      fontSize: typography.size.body,
      color: colors.text.secondary,
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <ChefHat size={64} color={colors.primary} strokeWidth={1.5} />
        </Animated.View>
      </View>
      <Text style={styles.text}>The Chef is thinking...</Text>
      <Text style={styles.subText}>Finding the perfect recipe for you</Text>
    </View>
  );
};
