import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';

interface TabSwitcherProps {
  activeTab: 'ingredients' | 'instructions';
  onTabChange: (tab: 'ingredients' | 'instructions') => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#F0F0F0',
      borderRadius: layout.radius.full,
      padding: 4,
      marginVertical: layout.spacing.lg,
      position: 'relative',
    },
    tabButton: {
      flex: 1,
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.md,
      alignItems: 'center',
      borderRadius: layout.radius.full,
    },
    activeTab: {
      backgroundColor: colors.surface,
    },
    tabText: {
      fontSize: typography.size.body,
      fontWeight: '500' as const,
      color: colors.text.secondary,
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: '700' as const,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.tabButton, activeTab === 'ingredients' && styles.activeTab]}
        onPress={() => onTabChange('ingredients')}
      >
        <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
          Ingredients
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tabButton, activeTab === 'instructions' && styles.activeTab]}
        onPress={() => onTabChange('instructions')}
      >
        <Text style={[styles.tabText, activeTab === 'instructions' && styles.activeTabText]}>
          Instructions
        </Text>
      </Pressable>
    </View>
  );
};
