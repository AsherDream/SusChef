import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { UnitSelectorModal } from './UnitSelectorModal';
import { useThemeColors } from '../core/theme/theme';
import { layout, typography } from '../core/theme/typography';
import { usePantryStore } from '../store/usePantryStore';

interface IngredientRowProps {
  id: string;
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
  id,
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
  const removeIngredient = usePantryStore((state) => state.removeIngredient);
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

  const handleDeletePress = async () => {
    console.log('🗑️ Delete button clicked for ingredient ID:', id);
    try {
      await removeIngredient(id);
    } catch (error) {
      console.error('Error removing ingredient:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: colors.surface,
      borderRadius: layout.radius.md,
      marginBottom: layout.spacing.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    ingredientNameContainer: {
      flex: 1,
      marginRight: 10,
    },
    label: {
      fontSize: typography.size.body,
      color: colors.text.primary,
      fontWeight: '500' as const,
    },
    controlsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
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
      width: 50,
      textAlign: 'center',
      marginHorizontal: 10,
    },
    unitPill: {
      paddingHorizontal: layout.spacing.xs,
      paddingVertical: 0,
      minWidth: 35,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    unitText: {
      fontSize: typography.size.caption,
      color: colors.primary,
      fontWeight: '600' as const,
    },
    deleteButton: {
      padding: layout.spacing.xs,
      marginLeft: 15,
    },
    disabledText: {
      color: colors.text.disabled,
    },
  });

  return (
    <>
      <View style={styles.container}>
        {/* Ingredient Name */}
        <View style={styles.ingredientNameContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>

        {/* Controls Container (Amount, Unit, Delete) */}
        <View style={styles.controlsContainer}>
          {/* Quantity Section */}
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
                <Pressable
                  style={styles.unitPill}
                  onPress={() => setIsModalVisible(true)}
                >
                  <Text style={styles.unitText}>{unit}</Text>
                </Pressable>
              </>
            ) : (
              <Text style={[styles.unitText, styles.disabledText]}>
                {amount} {unit}
              </Text>
            )}
          </View>

          {/* Delete Button */}
          {editable && (
            <Pressable
              style={styles.deleteButton}
              onPress={handleDeletePress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={20} stroke={colors.status.error} strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>

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
