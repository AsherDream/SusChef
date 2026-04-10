import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';
import { TabParamList } from '../../navigation/types';
import { RouteNames } from '../../navigation/routeNames';

type HomeScreenProps = NativeStackScreenProps<TabParamList, typeof RouteNames.Pantry>;

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: typography.size.h1,
      fontWeight: '700' as const,
      color: colors.text.primary,
      marginBottom: layout.spacing.md,
    },
    subtitle: {
      fontSize: typography.size.body,
      color: colors.text.secondary,
    },
  });

const styles = createStyles();

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SusChef!</Text>
      <Text style={styles.subtitle}>Your kitchen assistant</Text>
    </View>
  );
};

export default HomeScreen;
