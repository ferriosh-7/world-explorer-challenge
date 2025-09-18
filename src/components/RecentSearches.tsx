import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RecentSearch } from '../services/recentSearches';
import { colors, typography, spacing, textStyles } from '../theme';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSearchSelect: (query: string) => void;
  onSearchRemove: (id: string) => void;
  onClearAll: () => void;
  style?: ViewStyle;
  maxItems?: number;
  showClearAll?: boolean;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSearchSelect,
  onSearchRemove,
  onClearAll,
  style,
  maxItems = 10,
  showClearAll = true,
}) => {
  const displaySearches = searches.slice(0, maxItems);

  const renderSearchItem = ({ item }: { item: RecentSearch }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => onSearchSelect(item.query)}
      accessibilityLabel={`Recent search: ${item.query}`}
      accessibilityRole="button"
    >
      <View style={styles.searchContent}>
        <MaterialIcons 
          name="history" 
          size={18} 
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <View style={styles.searchText}>
          <Text style={styles.searchQuery}>{item.query}</Text>
          {item.resultCount !== undefined && (
            <Text style={styles.searchMeta}>
              {item.resultCount} result{item.resultCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onSearchRemove(item.id)}
        accessibilityLabel={`Remove search: ${item.query}`}
        accessibilityRole="button"
      >
        <MaterialIcons name="close" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (displaySearches.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        {showClearAll && displaySearches.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={onClearAll}
            accessibilityLabel="Clear all recent searches"
            accessibilityRole="button"
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={displaySearches}
        renderItem={renderSearchItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Compact version for search input dropdown
export const RecentSearchesDropdown: React.FC<{
  searches: RecentSearch[];
  onSearchSelect: (query: string) => void;
  visible: boolean;
  style?: ViewStyle;
}> = ({ searches, onSearchSelect, visible, style }) => {
  if (!visible || searches.length === 0) {
    return null;
  }

  const recentItems = searches.slice(0, 5);

  return (
    <View style={[styles.dropdown, style]}>
      {recentItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.dropdownItem}
          onPress={() => onSearchSelect(item.query)}
        >
          <MaterialIcons 
            name="history" 
            size={16} 
            color={colors.textSecondary}
            style={styles.dropdownIcon}
          />
          <Text style={styles.dropdownText}>{item.query}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    ...textStyles.h6,
    color: colors.textPrimary,
  },
  clearAllButton: {
    padding: spacing.sm,
  },
  clearAllText: {
    ...textStyles.caption,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
  },
  list: {
    maxHeight: 300,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchText: {
    flex: 1,
  },
  searchQuery: {
    ...textStyles.body1,
    color: colors.textPrimary,
  },
  searchMeta: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  removeButton: {
    padding: spacing.sm,
    marginLeft: spacing.md,
  },
  
  // Dropdown styles
  dropdown: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    marginTop: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dropdownIcon: {
    marginRight: spacing.md,
  },
  dropdownText: {
    ...textStyles.body2,
    color: colors.textPrimary,
    flex: 1,
  },
});

export default RecentSearches;
