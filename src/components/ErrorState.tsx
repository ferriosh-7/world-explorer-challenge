import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from './Button';
import { colors, typography, spacing } from '../theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | any;
  onRetry?: () => void;
  style?: ViewStyle;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  error,
  onRetry,
  style,
}) => {
  // Detect network errors
  const isNetworkError = error?.networkError || 
    error?.message?.toLowerCase().includes('network') ||
    error?.message?.toLowerCase().includes('fetch') ||
    error?.code === 'NETWORK_ERROR';

  const defaultTitle = isNetworkError ? 'Connection Problem' : 'Error';
  const defaultMessage = isNetworkError 
    ? 'Please check your internet connection and try again'
    : 'Something went wrong. Please try again.';

  const finalTitle = title || defaultTitle;
  const finalMessage = message || defaultMessage;

  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        name={isNetworkError ? 'wifi-off' : 'error-outline'}
        size={64}
        color={colors.error}
        style={styles.icon}
      />
      <Text style={styles.title}>{finalTitle}</Text>
      <Text style={styles.message}>{finalMessage}</Text>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="outline"
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  icon: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.h6,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: typography.weight.semibold,
  },
  message: {
    fontSize: typography.fontSize.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.weight.medium,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  retryButton: {
    minWidth: 120,
  },
});

export default ErrorState;
