import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InputField } from '../../components/InputField';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';
import { RouteNames } from '../../navigation/routeNames';
import { RootStackParamList } from '../../navigation/types';
import { useAuthForm } from './hooks/useAuthForm';

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, typeof RouteNames.Register>;

const createStyles = () => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.xl,
    paddingBottom: layout.spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
  },
  leafIcon: {
    marginBottom: layout.spacing.md,
  },
  title: {
    fontSize: typography.size.h1,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: layout.spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.body,
    color: colors.text.secondary,
  },
  formSection: {
    marginBottom: layout.spacing.xl,
  },
  errorText: {
    fontSize: typography.size.caption,
    color: colors.status.error,
    marginTop: -layout.spacing.sm,
    marginBottom: layout.spacing.md,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.radius.full,
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.lg,
  },
  registerButtonText: {
    color: colors.surface,
    fontSize: typography.size.body,
    fontWeight: '700' as const,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: layout.spacing.sm,
    marginTop: layout.spacing.lg,
  },
  loginText: {
    fontSize: typography.size.body,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: typography.size.body,
    color: colors.primary,
    fontWeight: '600' as const,
  },
});

const styles = createStyles();

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const {
    email,
    password,
    showPassword,
    isLoading,
    error,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleRegister,
  } = useAuthForm();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const handleRegisterPress = async () => {
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    setConfirmPasswordError(null);
    const success = await handleRegister();

    if (success) {
      navigation.navigate(RouteNames.MainApp);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate(RouteNames.Login);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={styles.leafIcon}>
              <Leaf size={64} color={colors.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SusChef and start cooking smarter</Text>
          </View>

          <View style={styles.formSection}>
            <InputField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              iconName="mail"
            />

            <InputField
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              iconName={showPassword ? 'eye' : 'eyeOff'}
              onIconPress={togglePasswordVisibility}
            />

            <InputField
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              iconName={showConfirmPassword ? 'eye' : 'eyeOff'}
              onIconPress={() => setShowConfirmPassword((prev) => !prev)}
            />

            {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <Pressable
            style={styles.registerButton}
            onPress={handleRegisterPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.registerButtonText}>Sign Up</Text>
            )}
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable onPress={handleGoToLogin} disabled={isLoading}>
              <Text style={styles.loginLink}>Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
