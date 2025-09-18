import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { SkeletonList, SkeletonCard, SkeletonCountryItem, SkeletonCountryDetail } from './SkeletonLoader';

type LoadingVariant = 'spinner' | 'skeleton-cards' | 'skeleton-countries' | 'skeleton-detail';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
  variant?: LoadingVariant;
  itemCount?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  style,
  variant = 'spinner',
  itemCount = 5,
}) => {
  if (variant === 'skeleton-cards') {
    return (
      <View style={[styles.skeletonContainer, style]}>
        <SkeletonList 
          itemCount={itemCount}
          renderItem={() => <SkeletonCard />}
        />
      </View>
    );
  }

  if (variant === 'skeleton-countries') {
    return (
      <View style={[styles.skeletonContainer, style]}>
        <SkeletonList 
          itemCount={itemCount}
          renderItem={() => <SkeletonCountryItem />}
        />
      </View>
    );
  }

  if (variant === 'skeleton-detail') {
    return (
      <View style={[styles.skeletonContainer, style]}>
        <SkeletonCountryDetail />
      </View>
    );
  }

  // Default spinner variant
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
  skeletonContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  text: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.body1,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
});

export default LoadingState;
