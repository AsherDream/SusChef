import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { layout } from '../core/theme/typography';

interface BaseRowProps {
  label: React.ReactNode;
  rightContent: React.ReactNode;
  leftIcon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const BaseRow: React.FC<BaseRowProps> = ({
  label,
  rightContent,
  leftIcon,
  onPress,
  style,
}) => {
  const content = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        },
        style,
      ]}
    >
      {leftIcon && <View style={{ marginRight: layout.spacing.md }}>{leftIcon}</View>}

      <View style={{ flex: 1, marginRight: 10 }}>{label}</View>

      <View style={{ flexShrink: 1 }}>{rightContent}</View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
};

export default BaseRow;
