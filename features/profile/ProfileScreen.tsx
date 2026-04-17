import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingRow } from '../../components/profile/SettingRow';
import { PreferenceToggle } from '../../components/profile/PreferenceToggle';
import { DietaryInfoRow } from '../../components/profile/DietaryInfoRow';
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
  const { user, updateProfile, updateDisplayName, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toggleTheme, dietaryStyle, setDietaryStyle, isDarkMode } = useAppStore();

  // Local state for allergies and consent (before saving to store)
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(user?.allergies || []);
  const [pdpaConsent, setPdpaConsent] = useState(user?.pdpaConsent || false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for editable name
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  // Display name with fallback
  const displayName = user?.displayName || 'Chef';
  const userEmail = user?.email || 'No email';

  // Avatar URL
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.displayName || 'Chef'
  )}&background=27ae60&color=fff`;

  const handleDietToggle = (diet: (typeof diets)[number]) => {
    setDietaryStyle(dietaryStyle === diet ? '' : diet);
  };

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      Alert.alert('Invalid Name', 'Please enter a valid name.');
      return;
    }

    setIsSavingName(true);
    try {
      await updateDisplayName(newName.trim());
      Alert.alert('Success', 'Your name has been updated!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save name. Please try again.');
      console.error('Error saving name:', error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setNewName(user?.displayName || '');
    setIsEditing(false);
  };

  const canSavePreferences = (): boolean => {
    if (selectedAllergies.length > 0) {
      return pdpaConsent;
    }
    return true;
  };

  const handleSavePreferences = async () => {
    if (selectedAllergies.length > 0 && !pdpaConsent) {
      Alert.alert(
        'Consent Required',
        'You must consent to data processing to save your allergy information.'
      );
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(selectedAllergies, pdpaConsent, dietaryStyle);
      Alert.alert('Success', 'Your preferences have been saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigation.replace(RouteNames.Login);
    } catch (error) {
      setIsLoggingOut(false);
      console.error('Logout error:', error);
      if (Platform.OS === 'web') {
        window.alert('Failed to log out. Please try again.');
      } else {
        Alert.alert('Logout Failed', 'Failed to logout. Please try again.');
      }
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* User Profile Header with Avatar */}
      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
          />
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Your Profile</Text>
        </View>
      </View>

      {/* Editable Profile Section */}
      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary, paddingHorizontal: layout.spacing.lg }]}>
          Profile Information
        </Text>

        {/* Full Name Field */}
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.text.secondary }]}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: colors.primary,
                  color: colors.text.primary,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={colors.text.disabled}
              value={newName}
              onChangeText={setNewName}
              editable={!isSavingName}
            />
          ) : (
            <Text style={[styles.fieldValue, { color: colors.text.primary }]}>{displayName}</Text>
          )}
        </View>

        {/* Email Field (Read-Only) */}
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.text.secondary }]}>Email</Text>
          <Text style={[styles.fieldValue, { color: colors.text.primary }]}>{userEmail}</Text>
        </View>

        {/* Save & Cancel Buttons or Edit Button */}
        {isEditing ? (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#27ae60', flex: 1 }]}
              onPress={handleSaveName}
              disabled={isSavingName}
            >
              <Text style={styles.saveButtonText}>
                {isSavingName ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: '#e74c3c', flex: 1 }]}
              onPress={handleCancelEdit}
              disabled={isSavingName}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary, marginHorizontal: layout.spacing.lg, marginVertical: layout.spacing.md }]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Name</Text>
          </TouchableOpacity>
        )}
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
            onToggle={() => handleDietToggle(diet)}
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
                    color: selectedAllergies.includes(allergy) ? colors.surface : colors.text.primary,
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
              {pdpaConsent && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={[styles.consentText, { color: colors.text.primary }]}>
              I consent to SusChef processing my allergy data.
            </Text>
          </View>
        </View>
      )}

      {/* Save Preferences Button */}
      {selectedAllergies.length > 0 || user?.allergies?.length || user?.pdpaConsent ? (
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: canSavePreferences() ? colors.primary : colors.text.disabled,
              opacity: canSavePreferences() ? 1 : 0.5,
              marginHorizontal: layout.spacing.lg,
            },
          ]}
          onPress={handleSavePreferences}
          disabled={!canSavePreferences() || isSaving}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Preferences'}</Text>
        </TouchableOpacity>
      ) : null}

      {/* App Settings */}
      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>App Settings</Text>
        <PreferenceToggle label="Dark Mode" isEnabled={isDarkMode} onToggle={toggleTheme} />
        {/* <SettingRow
          iconName="settings"
          label="Settings Details"
          onPress={() => navigation.navigate(RouteNames.SettingsDetail as never)}
        /> */}
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: layout.spacing.md,
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
  fieldRow: {
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fieldLabel: {
    fontSize: typography.size.caption,
    marginBottom: layout.spacing.xs,
  },
  fieldValue: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.medium as any,
  },
  editButton: {
    paddingVertical: layout.spacing.md,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold as any,
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: layout.radius.sm,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    fontSize: typography.size.body,
    minHeight: 44,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
    marginVertical: layout.spacing.md,
  },
  cancelButton: {
    paddingVertical: layout.spacing.md,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold as any,
  },
});
