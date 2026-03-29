import { useCallback, useState } from 'react';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../../../core/config/firebaseConfig';
import { isValidEmail } from '../../../core/utils/helpers';
import { useAuthStore } from '../../../store/useAuthStore';

export type SocialProvider = 'google' | 'facebook';

interface UseAuthFormReturn {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  togglePasswordVisibility: () => void;
  clearError: () => void;
  handleLogin: () => Promise<boolean>;
  handleRegister: () => Promise<boolean>;
  handleSocialLogin: (provider: SocialProvider) => Promise<boolean>;
}

const mapAuthError = (error: unknown): string => {
  if (typeof error === 'object' && error && 'code' in error) {
    switch ((error as { code: string }).code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please try again.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }

  return 'Something went wrong. Please try again.';
};

const toStoreUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName || undefined,
  emailVerified: user.emailVerified,
});

export const useAuthForm = (): UseAuthFormReturn => {
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const setAuthLoading = useAuthStore((state) => state.setLoading);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    if (error) {
      setError(null);
    }
  }, [error]);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    if (error) {
      setError(null);
    }
  }, [error]);

  const validateCredentials = useCallback((): boolean => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Email is required.');
      return false;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email.');
      return false;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    return true;
  }, [email, password]);

  const withLoading = useCallback(async (action: () => Promise<boolean>): Promise<boolean> => {
    setIsLoading(true);
    setAuthLoading(true);

    try {
      return await action();
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  }, [setAuthLoading]);

  const handleLogin = useCallback(async (): Promise<boolean> => {
    if (!validateCredentials()) {
      return false;
    }

    return withLoading(async () => {
      try {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        setUser(toStoreUser(result.user));
        setError(null);
        return true;
      } catch (err) {
        setError(mapAuthError(err));
        return false;
      }
    });
  }, [email, password, setUser, validateCredentials, withLoading]);

  const handleRegister = useCallback(async (): Promise<boolean> => {
    if (!validateCredentials()) {
      return false;
    }

    return withLoading(async () => {
      try {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        setUser(toStoreUser(result.user));
        setError(null);
        return true;
      } catch (err) {
        setError(mapAuthError(err));
        return false;
      }
    });
  }, [email, password, setUser, validateCredentials, withLoading]);

  const handleSocialLogin = useCallback(async (provider: SocialProvider): Promise<boolean> => {
    return withLoading(async () => {
      try {
        if (Platform.OS !== 'web') {
          setError(`${provider === 'google' ? 'Google' : 'Facebook'} login is not configured for native yet.`);
          return false;
        }

        const socialProvider = provider === 'google'
          ? new GoogleAuthProvider()
          : new FacebookAuthProvider();

        const result = await signInWithPopup(auth, socialProvider);
        setUser(toStoreUser(result.user));
        setError(null);
        return true;
      } catch (err) {
        setError(mapAuthError(err));
        return false;
      }
    });
  }, [setUser, withLoading]);

  return {
    email,
    password,
    showPassword,
    isLoading,
    error,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    clearError,
    handleLogin,
    handleRegister,
    handleSocialLogin,
  };
};
