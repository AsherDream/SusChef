import React from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { SettingRow } from '../../components/profile/SettingRow';
import { PreferenceToggle } from '../../components/profile/PreferenceToggle';
import { DietaryInfoRow } from '../../components/profile/DietaryInfoRow';
import { AllergyManager } from '../../components/profile/AllergyManager';
import { useAppStore } from '../../store/useAppStore';
import { layout, typography } from '../../core/theme/typography';
import { RouteNames } from '../../navigation/routeNames';
import { useThemeColors } from '../../core/theme/theme';

const dietDetails: Record<'Vegan' | 'Vegetarian' | 'Keto' | 'Paleo', string> = {
  Vegan: 'No animal products; plant-based meals only.',
  Vegetarian: 'No meat or fish; dairy and eggs are optional.',
  Keto: 'Low-carb, high-fat approach to promote ketosis.',
  Paleo: 'Focuses on whole foods; avoids grains, legumes, and processed items.',
};
const diets = Object.keys(dietDetails) as Array<keyof typeof dietDetails>;

export function ProfileScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const {
    toggleTheme,
    dietaryStyle,
    setDietaryStyle,
    isDarkMode,
  } = useAppStore();

  const handleDietToggle = (diet: typeof diets[number]) => {
    setDietaryStyle(dietaryStyle === diet ? '' : diet);
  };

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: RouteNames.Login as never }] });
  };

  const handleResetPassword = () => {
    Alert.alert('Reset Password', 'Password reset flow coming soon.');
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <ProfileHeader name="Alex Rivers" email="alex.rivers@example.com" />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Dietary Profile</Text>
        {diets.map((diet) => (
          <DietaryInfoRow
            key={diet}
            label={diet}
            description={dietDetails[diet]}
            isEnabled={dietaryStyle === diet}
            onToggle={() => handleDietToggle(diet)}
          />
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Allergies</Text>
        <AllergyManager />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>App Settings</Text>
        <PreferenceToggle
          label="Dark Mode"
          isEnabled={isDarkMode}
          onToggle={toggleTheme}
        />
        <SettingRow
          iconName="settings"
          label="Settings Details"
          onPress={() => navigation.navigate(RouteNames.SettingsDetail as never)}
        />
        <SettingRow iconName="refresh" label="Reset Password" onPress={handleResetPassword} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Account</Text>
        <SettingRow iconName="logout" label="Log Out" isDestructive onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: layout.spacing.lg,
    gap: layout.spacing.lg,
  },
  card: {
    borderRadius: layout.radius.md,
    paddingVertical: layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: typography.size.h2,
    fontWeight: typography.weight.bold as any,
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.sm,
  },
});
