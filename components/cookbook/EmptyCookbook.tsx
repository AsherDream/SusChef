import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { EmptyState } from '../EmptyState';
import { Button } from '../Button';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';

interface EmptyCookbookProps {
  onNavigateToPantry: () => void;
}

export const EmptyCookbook: React.FC<EmptyCookbookProps> = ({ onNavigateToPantry }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: layout.spacing.lg,
      gap: layout.spacing.lg,
    },
    emptyStateContainer: {
      alignItems: 'center',
    },
    buttonContainer: {
      width: '100%',
      maxWidth: 200,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.emptyStateContainer}>
        <EmptyState
          title="No Saved Recipes Yet"
          message="Start saving your favorite recipes to your cookbook"
          icon="book"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          text="Browse Recipes"
          onPress={onNavigateToPantry}
          variant="primary"
          size="lg"
          icon={<BookOpen size={20} stroke={colors.surface} strokeWidth={2} />}
        />
      </View>
    </View>
  );
};

export default EmptyCookbook;
