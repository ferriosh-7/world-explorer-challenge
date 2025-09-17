import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  count?: number;
  style?: ViewStyle;
  showCount?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onPress,
  count = 0,
  style,
  showCount = true,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.favoritesButton, style, {borderColor: count ? colors.secondary : colors.textPlaceholder }]}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `Favorites button with ${count} items`}
        accessibilityHint={accessibilityHint || 'Tap to view favorites'}
      >
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={count ? colors.secondary : colors.textPlaceholder}
          />
        </Animated.View>
        {showCount && count > 0 && (
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
    borderWidth: 1,
  },
  favoritesBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.secondary,
    borderRadius: spacing.md,
    minWidth: 24,
    height: 24,
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
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
});

export default FavoriteButton;
