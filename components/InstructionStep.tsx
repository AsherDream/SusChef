import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';

interface InstructionStepProps {
  stepNumber: number;
  instruction: string;
}

export const InstructionStep: React.FC<InstructionStepProps> = ({ stepNumber, instruction }) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: layout.spacing.lg,
      gap: layout.spacing.md,
    },
    badge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 2,
      minWidth: 32,
    },
    badgeText: {
      fontSize: typography.size.caption,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    instruction: {
      flex: 1,
      fontSize: typography.size.body,
      color: colors.text.primary,
      lineHeight: 24,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{stepNumber}</Text>
      </View>
      <Text style={styles.instruction}>{instruction}</Text>
    </View>
  );
};
