import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { BaseRow } from './BaseRow';
import { UnitSelectorModal } from './UnitSelectorModal';
import { useThemeColors } from '../core/theme/theme';
import { layout, typography } from '../core/theme/typography';

interface IngredientRowProps {
  label: string;
  amount?: number;
  unit?: string;
  icon?: React.ReactNode;
  onDelete?: () => void;
  onAmountChange?: (amount: number) => void;
  onUnitChange?: (unit: string) => void;
  editable?: boolean;
}

export const IngredientRow: React.FC<IngredientRowProps> = ({
  label,
  amount = 1,
  unit = 'pcs',
  icon,
  onDelete,
  onAmountChange,
  onUnitChange,
  editable = true,
}) => {
  const colors = useThemeColors();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amountText, setAmountText] = useState(amount.toString());

  const handleAmountChange = (text: string) => {
    setAmountText(text);
    const numValue = parseFloat(text) || 0;
    if (numValue >= 0 && onAmountChange) {
      onAmountChange(numValue);
    }
  };

  const handleUnitSelect = (selectedUnit: string) => {
    if (onUnitChange) {
      onUnitChange(selectedUnit);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: layout.radius.md,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.md,
      marginBottom: layout.spacing.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    label: {
      fontSize: typography.size.body,
      color: colors.text.primary,
      fontWeight: '500' as const,
    },
    rightContentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.sm,
    },
    quantityContainer: {
      backgroundColor: colors.background,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.radius.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.xs,
    },
    amountInput: {
      fontSize: typography.size.caption,
      color: colors.text.primary,
      fontWeight: '600' as const,
      paddingHorizontal: 0,
      paddingVertical: 0,
      minWidth: 30,
      textAlign: 'center',
    },
    unitPill: {
      paddingHorizontal: layout.spacing.xs,
      paddingVertical: 0,
      minWidth: 35,
      justifyContent: 'center',
      alignItems: 'center',
    },
    unitText: {
      fontSize: typography.size.caption,
      color: colors.primary,
      fontWeight: '600' as const,
    },
    deleteButton: {
      padding: layout.spacing.xs,
    },
    disabledText: {
      color: colors.text.disabled,
    },
  });

  const rightContent = (
    <View style={styles.rightContentContainer}>
      <View style={styles.quantityContainer}>
        {editable ? (
          <>
            <TextInput
              style={styles.amountInput}
              value={amountText}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.text.disabled}
              maxLength={5}
            />
            <Pressable style={styles.unitPill} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.unitText}>{unit}</Text>
            </Pressable>
          </>
        ) : (
          <Text style={[styles.unitText, styles.disabledText]}>
            {amount} {unit}
          </Text>
        )}
      </View>

      {editable && (
        <Pressable
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Trash2 size={20} stroke={colors.status.error} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );

  return (
    <>
      <BaseRow
        leftIcon={icon}
        label={<Text style={styles.label}>{label}</Text>}
        rightContent={rightContent}
        style={styles.container}
      />
      {editable && (
        <UnitSelectorModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelect={handleUnitSelect}
          currentUnit={unit}
        />
      )}
    </>
  );
};

export default IngredientRow;
