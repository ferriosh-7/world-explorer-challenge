import React from 'react';
import { TextInput, StyleSheet, ViewStyle, Platform, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  onClear?: () => void;
  showClearButton?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  style,
  onClear,
  showClearButton = true,
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        accessibilityLabel={`Search input: ${placeholder}`}
        accessibilityHint="Enter text to search"
        returnKeyType="search"
        clearButtonMode="never"
      />
      {showClearButton && value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <MaterialIcons name="clear" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'android' ? spacing.md : spacing.lg,
    fontSize: typography.base,
    color: colors.textPrimary,
    flex: 1,
    minHeight: Platform.OS === 'android' ? 56 : 48,
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingRight: 40, // Space for clear button
  },
  clearButton: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
});

export default SearchInput;
