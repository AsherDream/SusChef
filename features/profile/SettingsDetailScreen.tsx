import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { AvatarPicker } from '../../components/profile/AvatarPicker';
import { EditableUserField } from '../../components/profile/EditableUserField';
import { layout, typography } from '../../core/theme/typography';
import { useThemeColors } from '../../core/theme/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { RouteNames } from '../../navigation/routeNames';
import { RootStackParamList } from '../../navigation/types';

export function SettingsDetailScreen() {
  const colors = useThemeColors();
  const screenStyles = styles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuthStore();
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  // Use real user data from store with fallbacks
  const displayName = useMemo(() => user?.displayName || 'Chef', [user?.displayName]);
  const userEmail = useMemo(() => user?.email || 'No email', [user?.email]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleResetPassword = () => {
    Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
  };

  const handleChangeAccount = () => {
    Alert.alert('Change Account', 'This will navigate to account switching.');
  };

  const handleLogout = async () => {
    try {
      await logout();
      
      // Use reset to clear navigation history and navigate directly to Login screen
      // This ensures user cannot swipe back to the app after logout
      navigation.reset({ index: 0, routes: [{ name: RouteNames.Login as never }] });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', 'Failed to logout. Please try again.');
    }
  };

  return (
    <ScrollView style={[screenStyles.screen]}>
      {/* Back Button Header */}
      <View style={screenStyles.header}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [screenStyles.backButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <ChevronLeft size={24} color={colors.text.primary} />
          <Text style={[screenStyles.backText, { color: colors.text.primary }]}>Back</Text>
        </Pressable>
      </View>

      {/* User Profile Card */}
      <View style={[screenStyles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <View style={screenStyles.centered}>
          <AvatarPicker
            imageUri={avatar}
            onPick={() => Alert.alert('Pick Image', 'Hook up to image picker.')}
          />
        </View>

        {/* Display User Info (Read-only with fallback) */}
        <View style={screenStyles.userInfoSection}>
          <Text style={[screenStyles.label, { color: colors.text.secondary }]}>Full Name</Text>
          <Text style={[screenStyles.userValue, { color: colors.text.primary }]}>{displayName}</Text>
        </View>

        <View style={screenStyles.userInfoSection}>
          <Text style={[screenStyles.label, { color: colors.text.secondary }]}>Email</Text>
          <Text style={[screenStyles.userValue, { color: colors.text.primary }]}>{userEmail}</Text>
        </View>
      </View>

      {/* Password & Account Management */}
      <View style={[screenStyles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Pressable
          onPress={handleResetPassword}
          style={({ pressed }) => [
            screenStyles.button,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[screenStyles.buttonText, { color: colors.surface }]}>Reset Password</Text>
        </Pressable>
        <Pressable
          onPress={handleChangeAccount}
          style={({ pressed }) => [
            screenStyles.button,
            { backgroundColor: colors.secondary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[screenStyles.buttonText, { color: colors.text.primary }]}>Change Account</Text>
        </Pressable>
      </View>

      {/* Logout */}
      <View style={[screenStyles.card, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            screenStyles.button,
            screenStyles.destructiveButton,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[screenStyles.buttonText, { color: colors.status.error }]}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.sm,
  },
  backText: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.medium as any,
  },
  card: {
    marginHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.lg,
    borderRadius: layout.radius.md,
    padding: layout.spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  centered: {
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  userInfoSection: {
    marginBottom: layout.spacing.md,
  },
  label: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium as any,
    marginBottom: 4,
  },
  userValue: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.regular as any,
  },
  button: {
    borderRadius: layout.radius.md,
    paddingVertical: layout.spacing.md,
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  destructiveButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  buttonText: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.medium as any,
  },
});
