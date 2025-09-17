import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface CountryFavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const CountryFavoriteButton: React.FC<CountryFavoriteButtonProps> = ({
  isFavorite,
  onPress,
  style,
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
        style={[styles.favoriteButton, style]}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || (isFavorite ? 'Remove from favorites' : 'Add to favorites')}
        accessibilityHint={accessibilityHint || (isFavorite ? 'Tap to remove this country from your favorites' : 'Tap to add this country to your favorites')}
      >
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={isFavorite ? colors.secondary : colors.textPlaceholder}
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  favoriteButton: {
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CountryFavoriteButton;
