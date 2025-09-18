import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const createAnimation = () => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]);
    };

    const loopAnimation = Animated.loop(createAnimation());
    loopAnimation.start();

    return () => loopAnimation.stop();
  }, [animatedValue, animated]);

  const backgroundColor = animated
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.skeleton.base, colors.skeleton.highlight],
      })
    : colors.skeleton.base;

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Skeleton components for specific use cases
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.skeletonCard, style]}>
    <SkeletonLoader height={16} width="60%" style={{ marginBottom: spacing.sm }} />
    <SkeletonLoader height={14} width="40%" />
  </View>
);

export const SkeletonCountryItem: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.skeletonCountryItem, style]}>
    <View style={styles.skeletonCountryContent}>
      <SkeletonLoader height={18} width="70%" style={{ marginBottom: spacing.xs }} />
      <SkeletonLoader height={14} width="50%" style={{ marginBottom: spacing.xs }} />
      <SkeletonLoader height={12} width="40%" />
    </View>
    <SkeletonLoader width={24} height={24} borderRadius={12} />
  </View>
);

export const SkeletonCountryDetail: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.skeletonDetail, style]}>
    <SkeletonLoader height={32} width="80%" style={{ marginBottom: spacing.lg }} />
    <SkeletonLoader height={16} width="60%" style={{ marginBottom: spacing.md }} />
    <SkeletonLoader height={14} width="100%" style={{ marginBottom: spacing.sm }} />
    <SkeletonLoader height={14} width="90%" style={{ marginBottom: spacing.sm }} />
    <SkeletonLoader height={14} width="70%" style={{ marginBottom: spacing.lg }} />
    
    <View style={styles.skeletonRow}>
      <SkeletonLoader height={40} width="48%" />
      <SkeletonLoader height={40} width="48%" />
    </View>
  </View>
);

export const SkeletonList: React.FC<{ 
  itemCount?: number; 
  renderItem?: () => React.ReactElement;
  style?: ViewStyle;
}> = ({ 
  itemCount = 5, 
  renderItem = () => <SkeletonCard />,
  style 
}) => (
  <View style={style}>
    {Array.from({ length: itemCount }, (_, index) => (
      <View key={index} style={{ marginBottom: spacing.md }}>
        {renderItem()}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skeletonCountryItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonCountryContent: {
    flex: 1,
  },
  skeletonDetail: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
});

export default SkeletonLoader;
