import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ShoppingBasket,
  Inbox,
  Package,
  Heart,
  Utensils,
  Search,
  BookOpen,
} from 'lucide-react-native';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'shopping-basket',
}) => {
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'shopping-basket': ShoppingBasket,
      inbox: Inbox,
      package: Package,
      heart: Heart,
      utensils: Utensils,
      search: Search,
      book: BookOpen,
    };
    return iconMap[iconName.toLowerCase()] || ShoppingBasket;
  };

  const IconComponent = getIcon(icon);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: layout.spacing.md,
    },
    icon: {
      marginBottom: layout.spacing.sm,
    },
    title: {
      fontSize: typography.size.body,
      color: colors.text.secondary,
      fontWeight: '600' as const,
      textAlign: 'center',
    },
    message: {
      fontSize: typography.size.caption,
      color: colors.text.disabled,
      textAlign: 'center',
      maxWidth: 200,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <IconComponent size={48} stroke={colors.text.disabled} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default EmptyState;
