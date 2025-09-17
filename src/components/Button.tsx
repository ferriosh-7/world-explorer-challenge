import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    ...(style ? [style] : []),
  ];

  const textStyle: TextStyle[] = [
    styles.baseText,
    styles[`${variant}Text`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: spacing.lg,
    borderRadius: spacing.lg,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondaryBackground,
    borderWidth: 1,
    borderColor: colors.secondaryLight,
    shadowColor: colors.primary,
  },
  baseText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    letterSpacing: typography.letterSpacing.wide,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.secondary,
  },
});

export default Button;
