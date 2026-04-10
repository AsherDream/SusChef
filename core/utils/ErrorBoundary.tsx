/**
 * Error Boundary - Catch unhandled errors in React component tree
 */

import React, { ReactNode, ReactElement } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { layout, typography } from '../theme/typography';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches React errors and displays a user-friendly error screen
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </Text>
            {__DEV__ && this.state.error && (
              <Text style={styles.errorText}>{this.state.error.toString()}</Text>
            )}
          </View>
          <Pressable style={styles.button} onPress={this.resetError}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children as ReactElement;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
  },
  content: {
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
  },
  title: {
    fontSize: typography.size.h1,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.size.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: layout.spacing.lg,
    lineHeight: 24,
  },
  errorText: {
    fontSize: typography.size.caption,
    color: colors.status.error,
    backgroundColor: '#FFE0E0',
    padding: layout.spacing.md,
    borderRadius: layout.radius.md,
    marginTop: layout.spacing.md,
    maxHeight: 100,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.radius.full,
  },
  buttonText: {
    color: colors.surface,
    fontSize: typography.size.body,
    fontWeight: '700' as const,
  },
});
