import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from './Button';
import { colors, typography, spacing } from '../theme';

type EmptyStateVariant = 'search' | 'favorites' | 'countries' | 'generic';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  message?: string;
  actionTitle?: string;
  onAction?: () => void;
  searchQuery?: string;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'generic',
  title,
  message,
  actionTitle,
  onAction,
  searchQuery,
  style,
}) => {
  const getEmptyStateContent = () => {
    switch (variant) {
      case 'search':
        return {
          icon: 'search-off',
          title: title || 'No Results Found',
          message: message || (searchQuery 
            ? `No results match "${searchQuery}". Try different keywords or check your spelling.`
            : 'Try searching for something else.'
          ),
          actionTitle: actionTitle || 'Clear Search',
        };
      
      case 'favorites':
        return {
          icon: 'favorite-border',
          title: title || 'No Favorites Yet',
          message: message || 'Start exploring and add countries to your favorites by tapping the heart icon.',
          actionTitle: actionTitle || 'Explore Countries',
        };
      
      case 'countries':
        return {
          icon: 'public',
          title: title || 'No Countries Found',
          message: message || 'No countries are available in this region at the moment.',
          actionTitle: actionTitle || 'Go Back',
        };
      
      default:
        return {
          icon: 'info-outline',
          title: title || 'Nothing Here',
          message: message || 'There\'s nothing to show at the moment.',
          actionTitle: actionTitle || 'Go Back',
        };
    }
  };

  const { icon, title: defaultTitle, message: defaultMessage, actionTitle: defaultActionTitle } = getEmptyStateContent();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={icon as any}
          size={80}
          color={colors.textSecondary}
        />
      </View>
      
      <Text style={styles.title}>
        {title || defaultTitle}
      </Text>
      
      <Text style={styles.message}>
        {message || defaultMessage}
      </Text>
      
      {onAction && (
        <Button
          title={actionTitle || defaultActionTitle}
          onPress={onAction}
          variant="outline"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

// Specific empty state components for common use cases
export const SearchEmptyState: React.FC<{
  searchQuery: string;
  onClear?: () => void;
  style?: ViewStyle;
}> = ({ searchQuery, onClear, style }) => (
  <EmptyState
    variant="search"
    searchQuery={searchQuery}
    onAction={onClear}
    style={style}
  />
);

export const FavoritesEmptyState: React.FC<{
  onExplore?: () => void;
  style?: ViewStyle;
}> = ({ onExplore, style }) => (
  <EmptyState
    variant="favorites"
    onAction={onExplore}
    style={style}
  />
);

export const CountriesEmptyState: React.FC<{
  onGoBack?: () => void;
  style?: ViewStyle;
}> = ({ onGoBack, style }) => (
  <EmptyState
    variant="countries"
    onAction={onGoBack}
    style={style}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
    opacity: 0.7,
  },
  title: {
    fontSize: typography.fontSize.h4,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: typography.weight.semibold,
  },
  message: {
    fontSize: typography.fontSize.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.weight.medium,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.body1,
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  actionButton: {
    minWidth: 140,
    paddingHorizontal: spacing.xl,
  },
});

export default EmptyState;
