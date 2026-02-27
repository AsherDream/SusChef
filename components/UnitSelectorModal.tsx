import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import { Scale, Droplet, Package } from 'lucide-react-native';
import { UnitCategorySection, Unit } from './unit-selector/UnitCategorySection';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';

export interface UnitSelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (unit: string) => void;
  currentUnit: string;
}

interface UnitCategory {
  title: string;
  icon: React.ReactNode;
  units: Unit[];
}

const createUnitCategories = (): UnitCategory[] => [
  {
    title: 'WEIGHT',
    icon: <Scale size={18} stroke={colors.primary} strokeWidth={2} />,
    units: [
      { abbreviation: 'g', fullName: 'Grams', value: 'g' },
      { abbreviation: 'kg', fullName: 'Kilograms', value: 'kg' },
      { abbreviation: 'oz', fullName: 'Ounces', value: 'oz' },
      { abbreviation: 'lb', fullName: 'Pounds', value: 'lb' },
    ],
  },
  {
    title: 'VOLUME',
    icon: <Droplet size={18} stroke={colors.primary} strokeWidth={2} />,
    units: [
      { abbreviation: 'ml', fullName: 'Milliliters', value: 'ml' },
      { abbreviation: 'l', fullName: 'Liters', value: 'l' },
      { abbreviation: 'cup', fullName: 'Cups', value: 'cup' },
      { abbreviation: 'tbsp', fullName: 'Tablespoons', value: 'tbsp' },
      { abbreviation: 'tsp', fullName: 'Teaspoons', value: 'tsp' },
    ],
  },
  {
    title: 'COUNT',
    icon: <Package size={18} stroke={colors.primary} strokeWidth={2} />,
    units: [
      { abbreviation: 'pcs', fullName: 'Pieces', value: 'pcs' },
      { abbreviation: 'units', fullName: 'Units', value: 'units' },
      { abbreviation: 'cans', fullName: 'Cans', value: 'cans' },
      { abbreviation: 'bags', fullName: 'Bags', value: 'bags' },
      { abbreviation: 'cloves', fullName: 'Cloves', value: 'cloves' },
    ],
  },
];

export const UnitSelectorModal: React.FC<UnitSelectorModalProps> = ({
  isVisible,
  onClose,
  onSelect,
  currentUnit,
}) => {
  const { height } = useWindowDimensions();
  const [selectedUnit, setSelectedUnit] = useState<string>(currentUnit);
  const maxHeight = Math.min(height * 0.6, 600);
  const categories = createUnitCategories();

  const handleConfirm = () => {
    onSelect(selectedUnit);
    onClose();
  };

  const isConfirmDisabled = selectedUnit === currentUnit;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { maxHeight }]}
          onPress={(e: GestureResponderEvent) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <View style={styles.header}>
            <View style={styles.grabberContainer}>
              <View style={styles.grabber} />
            </View>
            <Text style={styles.headerTitle}>Select Unit</Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
          >
            {categories.map((category) => (
              <UnitCategorySection
                key={category.title}
                title={category.title}
                icon={category.icon}
                units={category.units}
                selectedUnit={selectedUnit}
                onSelectUnit={setSelectedUnit}
              />
            ))}
          </ScrollView>

          {/* Fixed Footer */}
          <View style={styles.footer}>
            <Pressable
              style={[
                styles.confirmButton,
                isConfirmDisabled && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: layout.spacing.lg,
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  grabberContainer: {
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.disabled,
  },
  headerTitle: {
    fontSize: typography.size.h2,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.md,
    paddingBottom: layout.spacing.lg,
  },
  footer: {
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.md,
    borderRadius: layout.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: typography.size.body,
    fontWeight: '600' as const,
    color: colors.surface,
  },
});

export default UnitSelectorModal;
