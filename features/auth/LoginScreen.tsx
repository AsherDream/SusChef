import React from 'react';
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
import { SocialButton } from '../../components/SocialButton';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';
import { RouteNames } from '../../navigation/routeNames';
import { RootStackParamList } from '../../navigation/types';
import { useAuthForm } from './hooks/useAuthForm';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, typeof RouteNames.Login>;

// Move styles outside component
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: layout.spacing.sm,
  },
  forgotPasswordText: {
    fontSize: typography.size.caption,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  errorText: {
    fontSize: typography.size.caption,
    color: colors.status.error,
    marginTop: -layout.spacing.sm,
    marginBottom: layout.spacing.md,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.radius.full,
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.lg,
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: typography.size.body,
    fontWeight: '700' as const,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
    gap: layout.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: typography.size.caption,
    color: colors.text.secondary,
  },
  socialSection: {
    flexDirection: 'row',
    gap: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  socialButton: {
    flex: 1,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: layout.spacing.sm,
    marginTop: layout.spacing.lg,
  },
  signUpText: {
    fontSize: typography.size.body,
    color: colors.text.secondary,
  },
  signUpLink: {
    fontSize: typography.size.body,
    color: colors.primary,
    fontWeight: '600' as const,
  },
});

const styles = createStyles();

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const {
    email,
    password,
    showPassword,
    isLoading,
    error,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleLogin,
    handleSocialLogin,
  } = useAuthForm();

  const handleLoginPress = async () => {
    const success = await handleLogin();
    if (success) {
      navigation.navigate(RouteNames.MainApp);
    }
  };

  const handleGoogleLoginPress = async () => {
    const success = await handleSocialLogin('google');
    if (success) {
      navigation.navigate(RouteNames.MainApp);
    }
  };

  const handleFacebookLoginPress = async () => {
    const success = await handleSocialLogin('facebook');
    if (success) {
      navigation.navigate(RouteNames.MainApp);
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate(RouteNames.Register);
  };

  const handleForgotPassword = () => {
    navigation.navigate(RouteNames.ForgotPassword);
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.leafIcon}>
              <Leaf size={64} color={colors.primary} />
            </View>
            <Text style={styles.title}>SusChef</Text>
            <Text style={styles.subtitle}>Turn leftovers into meals</Text>
          </View>

          {/* Form Section */}
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              iconName={showPassword ? 'eye' : 'eyeOff'}
              onIconPress={togglePasswordVisibility}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>
          </View>

          {/* Action Section */}
          <Pressable
            style={styles.loginButton}
            onPress={handleLoginPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Section */}
          <View style={styles.socialSection}>
            <View style={styles.socialButton}>
              <SocialButton
                title="Google"
                iconName="google"
                onPress={handleGoogleLoginPress}
              />
            </View>
            <View style={styles.socialButton}>
              <SocialButton
                title="Facebook"
                iconName="facebook"
                onPress={handleFacebookLoginPress}
              />
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <Pressable onPress={handleSignUpPress} disabled={isLoading}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
