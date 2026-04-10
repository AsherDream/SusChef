import React from 'react';
import { Pressable, Text, StyleSheet, View, Platform, Vibration } from 'react-native';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';

export interface UnitTileProps {
  abbreviation: string;
  fullName: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const UnitTile: React.FC<UnitTileProps> = ({
  abbreviation,
  fullName,
  isSelected,
  onSelect,
}) => {
  const handlePress = () => {
    // Trigger haptic feedback
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(50);
    }
    onSelect();
  };

  const styles = StyleSheet.create({
    tile: {
      width: '31.5%',
      aspectRatio: 1,
      borderRadius: layout.radius.md,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isSelected ? colors.primary : '#E5E5E5',
      backgroundColor: isSelected ? colors.primary : '#F5F5F5',
    },
    tileContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    abbreviation: {
      fontSize: typography.size.body,
      fontWeight: '700' as const,
      color: isSelected ? colors.surface : colors.text.primary,
    },
    fullName: {
      fontSize: typography.size.caption,
      fontWeight: '400' as const,
      color: isSelected ? 'rgba(255, 255, 255, 0.8)' : colors.text.secondary,
      marginTop: layout.spacing.xs,
    },
  });

  return (
    <Pressable style={styles.tile} onPress={handlePress}>
      <View style={styles.tileContent}>
        <Text style={styles.abbreviation}>{abbreviation}</Text>
        <Text style={styles.fullName} numberOfLines={1}>
          {fullName}
        </Text>
      </View>
    </Pressable>
  );
};

export default UnitTile;
