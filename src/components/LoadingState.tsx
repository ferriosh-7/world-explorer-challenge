import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: spacing.lg,
    fontSize: typography.base,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
});

export default LoadingState;
