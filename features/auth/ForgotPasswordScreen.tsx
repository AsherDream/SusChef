import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InputField } from '../../components/InputField';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';
import { RouteNames } from '../../navigation/routeNames';
import { RootStackParamList } from '../../navigation/types';
import { isValidEmail } from '../../core/utils/helpers';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof RouteNames.ForgotPassword
>;

const createStyles = () =>
  StyleSheet.create({
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.xl,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.sm,
    },
    backText: {
      fontSize: typography.size.body,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: layout.spacing.xl,
    },
    title: {
      fontSize: typography.size.h1,
      fontWeight: '700' as const,
      color: colors.text.primary,
      marginBottom: layout.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.size.body,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    formSection: {
      marginBottom: layout.spacing.xl,
    },
    errorText: {
      fontSize: typography.size.caption,
      color: colors.status.error,
      marginTop: layout.spacing.sm,
      marginBottom: layout.spacing.md,
    },
    sendButton: {
      backgroundColor: colors.primary,
      borderRadius: layout.radius.full,
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: layout.spacing.xl,
    },
    sendButtonText: {
      color: colors.surface,
      fontSize: typography.size.body,
      fontWeight: '700' as const,
    },
    backToLoginContainer: {
      alignItems: 'center',
      paddingVertical: layout.spacing.md,
    },
    backToLoginText: {
      fontSize: typography.size.body,
      color: colors.text.secondary,
    },
    backToLoginLink: {
      fontSize: typography.size.body,
      color: colors.primary,
      fontWeight: '600' as const,
    },
  });

const styles = createStyles();

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackToLogin = () => {
    navigation.navigate(RouteNames.Login);
  };

  const handleSendResetLink = async () => {
    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success alert
      Alert.alert('Link Sent', 'Check your email for the reset link.');

      // Return to login after showing alert
      setTimeout(() => {
        navigation.navigate(RouteNames.Login);
      }, 500);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          {/* Back Button */}
          <Pressable
            style={styles.header}
            onPress={handleBackToLogin}
          >
            <View style={styles.backButton}>
              <ChevronLeft size={24} color={colors.primary} />
              <Text style={styles.backText}>Back</Text>
            </View>
          </Pressable>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we will send you a reset link.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <InputField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(null);
              }}
              iconName="mail"
            />

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Send Button */}
          <Pressable
            style={styles.sendButton}
            onPress={handleSendResetLink}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </Pressable>

          {/* Back to Login Link */}
          <View style={styles.backToLoginContainer}>
            <Text style={styles.backToLoginText}>
              Remember your password?{' '}
            </Text>
            <Pressable onPress={handleBackToLogin}>
              <Text style={styles.backToLoginLink}>Back to Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
