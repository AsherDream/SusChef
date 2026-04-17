import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { layout, typography } from '../core/theme/typography';
import { useThemeColors } from '../core/theme/theme';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onActionPress,
}) => {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: layout.spacing.lg,
      paddingBottom: layout.spacing.sm,
    },
    title: {
      fontSize: typography.size.caption,
      color: colors.text.secondary,
      fontWeight: '600' as const,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    actionText: {
      fontSize: typography.size.caption,
      color: colors.primary,
      fontWeight: '600' as const,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionText && (
        <Pressable onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default SectionHeader;
