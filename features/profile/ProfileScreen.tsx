import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { SettingRow } from '../../components/profile/SettingRow';
import { PreferenceToggle } from '../../components/profile/PreferenceToggle';
import { DietaryInfoRow } from '../../components/profile/DietaryInfoRow';
import { AllergyManager } from '../../components/profile/AllergyManager';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { layout, typography } from '../../core/theme/typography';
import { RouteNames } from '../../navigation/routeNames';
import { useThemeColors } from '../../core/theme/theme';
import { RootStackParamList } from '../../navigation/types';

const dietDetails: Record<'Vegan' | 'Vegetarian' | 'Keto' | 'Paleo', string> = {
  Vegan: 'No animal products; plant-based meals only.',
  Vegetarian: 'No meat or fish; dairy and eggs are optional.',
  Keto: 'Low-carb, high-fat approach to promote ketosis.',
  Paleo: 'Focuses on whole foods; avoids grains, legumes, and processed items.',
};
const diets = Object.keys(dietDetails) as Array<keyof typeof dietDetails>;

const COMMON_ALLERGIES = ['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy', 'Eggs', 'Tree Nuts'];

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const colors = useThemeColors();
  const { user, updateProfile } = useAuthStore();
  const {
    toggleTheme,
    dietaryStyle,
    setDietaryStyle,
    isDarkMode,
  } = useAppStore();

  // Local state for allergies and consent (before saving to store)
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(user?.allergies || []);
  const [pdpaConsent, setPdpaConsent] = useState(user?.pdpaConsent || false);
  const [isSaving, setIsSaving] = useState(false);

  // Display name with fallback
  const displayName = user?.displayName || 'Chef';
  const userEmail = user?.email || 'No email';

  const handleDietToggle = (diet: typeof diets[number]) => {
    setDietaryStyle(dietaryStyle === diet ? '' : diet);
  };

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy]
    );
  };

  const canSavePreferences = (): boolean => {
    // If allergies are selected, consent must be checked
    if (selectedAllergies.length > 0) {
      return pdpaConsent;
    }
    // If no allergies, consent is not required
    return true;
  };

  const handleSavePreferences = async () => {
    // Validate before saving
    if (selectedAllergies.length > 0 && !pdpaConsent) {
      Alert.alert(
        'Consent Required',
        'You must consent to data processing to save your allergy information.'
      );
      return;
    }

    setIsSaving(true);
    try {
      // Save to Zustand store and Firestore
      await updateProfile(selectedAllergies, pdpaConsent);
      Alert.alert('Success', 'Your allergy preferences have been saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: RouteNames.Login as never }] });
  };

  const handleResetPassword = () => {
    Alert.alert('Reset Password', 'Password reset flow coming soon.');
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* User Profile Header */}
      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <ProfileHeader name={displayName} email={userEmail} />
      </View>

      {/* Dietary Profile */}
      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Dietary Profile</Text>
        {diets.map((diet) => (
          <DietaryInfoRow
            key={diet}
            label={diet}
            description={dietDetails[diet]}
            isEnabled={dietaryStyle === diet}
            onToggle={() => handleDietToggle(diet as any)}
          />
        ))}
      </View>

      {/* Allergies Section */}
      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Allergies & Dietary Restrictions
        </Text>
        <Text style={[styles.allergyDescription, { color: colors.text.secondary }]}>
          Select any allergies or dietary restrictions to personalize your recipe recommendations.
        </Text>

        {/* Allergy Grid */}
        <View style={styles.allergyGrid}>
          {COMMON_ALLERGIES.map((allergy) => (
            <TouchableOpacity
              key={allergy}
              style={[
                styles.allergyTile,
                {
                  backgroundColor: selectedAllergies.includes(allergy)
                    ? colors.primary
                    : colors.background,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => toggleAllergy(allergy)}
            >
              <Text
                style={[
                  styles.allergyText,
                  {
                    color: selectedAllergies.includes(allergy)
                      ? '#fff'
                      : colors.text.primary,
                  },
                ]}
              >
                {allergy}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* PDPA Consent Section (only shown if allergies are selected) */}
      {selectedAllergies.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Data Protection & Privacy
          </Text>

          <View style={styles.disclaimerBox}>
            <Text style={[styles.disclaimerText, { color: colors.text.secondary }]}>
              To provide safe recipe recommendations, SusChef needs to process your dietary data.
              You can delete this data at any time.
            </Text>
          </View>

          {/* Consent Checkbox */}
          <View style={styles.consentRow}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                {
                  backgroundColor: pdpaConsent ? colors.primary : colors.background,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setPdpaConsent(!pdpaConsent)}
            >
              {pdpaConsent && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
            <Text style={[styles.consentText, { color: colors.text.primary }]}>
              I consent to SusChef processing my allergy data.
            </Text>
          </View>
        </View>
      )}

      {/* Save Preferences Button */}
      {selectedAllergies.length > 0 || user?.allergies.length || user?.pdpaConsent ? (
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: canSavePreferences() ? colors.primary : colors.text.disabled,
              opacity: canSavePreferences() ? 1 : 0.5,
            },
          ]}
          onPress={handleSavePreferences}
          disabled={!canSavePreferences() || isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Existing App Settings */}
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

      {/* Account Settings */}
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
  allergyDescription: {
    fontSize: typography.size.caption,
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.md,
    lineHeight: 20,
  },
  allergyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: layout.spacing.lg,
    gap: layout.spacing.sm,
  },
  allergyTile: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.radius.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  allergyText: {
    fontSize: typography.size.small,
    fontWeight: typography.weight.medium as any,
  },
  disclaimerBox: {
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.md,
    marginVertical: layout.spacing.sm,
    borderLeftWidth: 3,
  },
  disclaimerText: {
    fontSize: typography.size.caption,
    lineHeight: 20,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    gap: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  consentText: {
    flex: 1,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium as any,
  },
  saveButton: {
    paddingVertical: layout.spacing.md,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold as any,
  },
});
