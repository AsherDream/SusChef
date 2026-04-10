import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';

interface KeyboardDismissWrapperProps {
  children: React.ReactNode;
}

export const KeyboardDismissWrapper: React.FC<KeyboardDismissWrapperProps> = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardDismissWrapper;
