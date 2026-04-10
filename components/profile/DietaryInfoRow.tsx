import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import { layout, typography } from '../../core/theme/typography';
import { useThemeColors } from '../../core/theme/theme';

interface DietaryInfoRowProps {
  label: string;
  description: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export function DietaryInfoRow({ label, description, isEnabled, onToggle }: DietaryInfoRowProps) {
  const colors = useThemeColors();

  const handleInfo = () => {
    Alert.alert(label, description);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Pressable style={styles.labelRow} onPress={handleInfo} hitSlop={8}>
        <Text style={[styles.label, { color: colors.text.primary }]}>{label}</Text>
        <HelpCircle size={18} color={colors.text.secondary} />
      </Pressable>
      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
        thumbColor={isEnabled ? colors.primary : '#FFFFFF'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.md,
    borderRadius: layout.radius.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.sm,
  },
  label: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.medium as any,
  },
});
