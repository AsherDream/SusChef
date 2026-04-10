import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { layout, typography } from '../../core/theme/typography';
import { useThemeColors } from '../../core/theme/theme';

export function AllergyManager() {
  const colors = useThemeColors();
  const { allergies, toggleAllergy } = useAppStore();
  const [value, setValue] = useState('');

  const handleAdd = () => {
    const normalized = value.trim();
    if (!normalized) return;
    if (allergies.some((a) => a.toLowerCase() === normalized.toLowerCase())) {
      setValue('');
      return;
    }
    toggleAllergy(normalized);
    setValue('');
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Add allergy"
          placeholderTextColor={colors.text.secondary}
          style={[styles.input, { color: colors.text.primary }]}
        />
        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Plus size={18} color={colors.surface} />
        </Pressable>
      </View>

      <View style={styles.chipsContainer}>
        {allergies.map((item) => (
          <View key={item} style={[styles.chip, { backgroundColor: colors.primary }]}>
            <Text style={[styles.chipText, { color: colors.surface }]}>{item}</Text>
            <Pressable onPress={() => toggleAllergy(item)} hitSlop={8}>
              <X size={14} color={colors.surface} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: layout.radius.md,
    paddingRight: layout.spacing.xs,
    paddingLeft: layout.spacing.md,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: typography.size.body,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.xs,
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.radius.full,
  },
  chipText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium as any,
  },
});
