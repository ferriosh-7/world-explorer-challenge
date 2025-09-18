import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { colors, typography, spacing } from '../theme';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  count?: number;
  style?: ViewStyle;
  showCount?: boolean;
  variant?: 'default' | 'compact';
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onPress,
  count = 0,
  style,
  showCount = true,
  variant = 'default',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Add haptic feedback
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    // Scale down animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Bounce animation for the icon
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const isCompact = variant === 'compact';
  const buttonStyle = isCompact ? styles.compactButton : styles.favoritesButton;
  const iconColor = isCompact 
    ? (isFavorite ? colors.secondary : colors.textPlaceholder)
    : (count ? colors.secondary : colors.textPlaceholder);
  const borderColor = isCompact ? 'transparent' : (count ? colors.secondary : colors.textPlaceholder);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[buttonStyle, style, { borderColor }]}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || (isCompact 
          ? (isFavorite ? 'Remove from favorites' : 'Add to favorites')
          : `Favorites button with ${count} items`)}
        accessibilityHint={accessibilityHint || (isCompact 
          ? (isFavorite ? 'Tap to remove this country from your favorites' : 'Tap to add this country to your favorites')
          : 'Tap to view favorites')}
      >
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={iconColor}
          />
        </Animated.View>
        {!isCompact && showCount && count > 0 && (
          <View style={styles.favoritesBadge}>
            <Text style={styles.favoritesCount}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  favoritesButton: {
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 52,
    minHeight: 52,
  },
  compactButton: {
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  favoritesBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.secondary,
    borderRadius: spacing.md,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  favoritesCount: {
    color: colors.white,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.weight.bold,
  },
});

export default FavoriteButton;
