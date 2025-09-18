import React, { useState, useRef } from 'react';
import { TextInput, StyleSheet, ViewStyle, Platform, View, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing } from '../theme';
import { RecentSearchesDropdown } from './RecentSearches';
import { useRecentSearches } from '../hooks/useRecentSearches';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  onClear?: () => void;
  showClearButton?: boolean;
  showRecentSearches?: boolean;
  onSubmit?: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  style,
  onClear,
  showClearButton = true,
  showRecentSearches = true,
  onSubmit,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { recentSearches, addRecentSearch } = useRecentSearches();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const handleSubmit = () => {
    if (value.trim()) {
      addRecentSearch(value.trim());
      onSubmit?.(value.trim());
      inputRef.current?.blur();
    }
  };

  const handleRecentSearchSelect = (query: string) => {
    onChangeText(query);
    setIsFocused(false);
    inputRef.current?.blur();
    onSubmit?.(query);
  };

  const showDropdown = showRecentSearches && isFocused && value.length === 0 && recentSearches.length > 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onSubmitEditing={handleSubmit}
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
      
      <RecentSearchesDropdown
        searches={recentSearches}
        onSearchSelect={handleRecentSearchSelect}
        visible={showDropdown}
        style={styles.dropdown}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  inputContainer: {
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
    fontSize: typography.fontSize.body1,
    color: colors.textPrimary,
    flex: 1,
    minHeight: Platform.OS === 'android' ? 56 : 48,
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 5,
  },
  clearButton: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export default SearchInput;
