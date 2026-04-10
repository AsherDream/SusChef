import React from 'react';
import { View, ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';

interface CookbookFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export const CookbookFilter: React.FC<CookbookFilterProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: layout.spacing.lg,
      paddingVertical: layout.spacing.md,
    },
    scrollView: {
      flexGrow: 0,
    },
    pillsContainer: {
      flexDirection: 'row',
      gap: layout.spacing.sm,
    },
    pill: {
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.radius.full,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 32,
    },
    pillText: {
      fontSize: typography.size.caption,
      fontWeight: '500' as const,
    },
  });

  const getPillStyle = (isSelected: boolean) => ({
    ...styles.pill,
    backgroundColor: isSelected ? colors.primary : `${colors.primary}22`, // ~13% opacity
  });

  const getPillTextStyle = (isSelected: boolean) => ({
    ...styles.pillText,
    color: isSelected ? colors.surface : colors.primary,
  });

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollView}
      >
        <View style={styles.pillsContainer}>
          {/* "All" option */}
          <Pressable style={getPillStyle(selectedCategory === null)} onPress={() => onSelect(null)}>
            <Text style={getPillTextStyle(selectedCategory === null)}>All</Text>
          </Pressable>

          {/* Category pills */}
          {categories.map((category) => (
            <Pressable
              key={category}
              style={getPillStyle(selectedCategory === category)}
              onPress={() => onSelect(category)}
            >
              <Text style={getPillTextStyle(selectedCategory === category)}>{category}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CookbookFilter;
