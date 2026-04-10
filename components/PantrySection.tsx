import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { InputField } from './InputField';
import { SectionHeader } from './SectionHeader';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';

interface PantrySectionProps {
  title: string;
  placeholder: string;
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  onAddItem: (value: string) => void;
  flex?: number;
  showsVerticalScrollIndicator?: boolean;
}

export const PantrySection: React.FC<PantrySectionProps> = ({
  title,
  placeholder,
  data,
  renderItem,
  onAddItem,
  flex = 1,
  showsVerticalScrollIndicator = true,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim()) {
      onAddItem(inputValue);
      setInputValue('');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: flex,
      backgroundColor: colors.background,
      paddingHorizontal: layout.spacing.lg,
    },
    listContainer: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <SectionHeader title={title} />

      <InputField
        label=""
        placeholder={placeholder}
        value={inputValue}
        onChangeText={setInputValue}
        onIconPress={handleAddItem}
        iconName="plus"
      />

      {data.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={data}
            renderItem={({ item, index }) => <View key={index}>{renderItem(item, index)}</View>}
            scrollEnabled={true}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            contentContainerStyle={{ paddingBottom: layout.spacing.md }}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={{
              fontSize: typography.size.body,
              color: colors.text.secondary,
              fontWeight: '600' as const,
              textAlign: 'center',
            }}
          >
            No items yet
          </Text>
          <Text
            style={{
              fontSize: typography.size.caption,
              color: colors.text.disabled,
              textAlign: 'center',
              marginTop: layout.spacing.sm,
            }}
          >
            Add your first item to get started
          </Text>
        </View>
      )}
    </View>
  );
};

export default PantrySection;
