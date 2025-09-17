import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  style?: ViewStyle;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error',
  message = 'Something went wrong',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
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
  title: {
    fontSize: typography.lg,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: typography.semibold,
  },
  message: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.medium,
  },
});

export default ErrorState;
