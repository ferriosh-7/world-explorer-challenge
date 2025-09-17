import React, { useState, memo, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CountryListItem } from '../types';
import { GET_ALL_COUNTRIES } from '../services/queries';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';
import { Card, SearchInput, CountryFavoriteButton, LoadingState, ErrorState, Button } from '../components';
import { colors, typography, spacing } from '../theme';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

const FavoritesScreen = memo(() => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, removeFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, loading, error } = useQuery<{ countries: CountryListItem[] }>(GET_ALL_COUNTRIES);

  const handleCountryPress = useCallback((country: CountryListItem) => {
    navigation.navigate('Country', { countryCode: country.code });
  }, [navigation]);

  const handleFavoritePress = useCallback(async (countryCode: string) => {
    await removeFavorite(countryCode);
  }, [removeFavorite]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const countries = useMemo(() => data?.countries || [], [data?.countries]);

  // Filter countries to only show favorites
  const favoriteCountries = useMemo(() => 
    countries.filter((country: CountryListItem) =>
      favorites.includes(country.code)
    ), [countries, favorites]
  );

  // Apply search filter to favorite countries
  const filteredCountries = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return favoriteCountries;
    
    return favoriteCountries.filter((country: CountryListItem) => {
      const query = debouncedSearchQuery.toLowerCase();
      const matchesName = country.name.toLowerCase().includes(query);
      const matchesLanguage = country.languages?.some(lang => 
        lang.name.toLowerCase().includes(query)
      );
      return matchesName || matchesLanguage;
    });
  }, [favoriteCountries, debouncedSearchQuery]);

  const renderCountry = useCallback(({ item }: { item: CountryListItem }) => (
    <Card 
      onPress={() => handleCountryPress(item)} 
      style={styles.countryCard}
      accessibilityLabel={`View details for ${item.name}`}
      accessibilityHint={`Navigate to view detailed information about ${item.name}`}
    >
      <View style={styles.countryInfo}>
        <Text style={styles.countryEmoji}>{item.emoji}</Text>
        <View style={styles.countryDetails}>
          <Text style={styles.countryName}>{item.name}</Text>
          <Text style={styles.countryCode}>{item.code}</Text>
          {item.currency && (
            <Text style={styles.countryCurrency}>Currency: {item.currency}</Text>
          )}
          {item.languages && item.languages.length > 0 && (
            <Text style={styles.countryLanguages}>
              Languages: {item.languages.map(lang => lang.name).join(', ')}
            </Text>
          )}
        </View>
      </View>
      <CountryFavoriteButton
        isFavorite={true}
        onPress={() => handleFavoritePress(item.code)}
      />
    </Card>
  ), [handleCountryPress, handleFavoritePress]);

  const renderEmptyState = () => {
    const isSearching = searchQuery.length > 0;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{isSearching ? '🔍' : '💜'}</Text>
        <Text style={styles.emptyTitle}>
          {isSearching ? 'No Results Found' : 'No Favorites Yet'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {isSearching 
            ? `No favorites match "${searchQuery}". Try a different search term.`
            : 'Start exploring countries and add them to your favorites by tapping the heart icon.'
          }
        </Text>
        {!isSearching && (
          <Button
            title="Explore Countries"
            onPress={() => navigation.navigate('Home')}
            variant="primary"
            style={styles.exploreButton}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return <LoadingState message="Loading favorites..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading favorites"
        message={error.message}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteCountries.length} favorite{favoriteCountries.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {favoriteCountries.length > 0 && (
        <View style={styles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search favorites..."
            onClear={handleSearchClear}
          />
        </View>
      )}
      
      <FlatList
        data={filteredCountries}
        renderItem={renderCountry}
        keyExtractor={(item) => item.code}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 100, // Approximate item height
          offset: 100 * index,
          index,
        })}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  countryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  header: {
    padding: spacing['2xl'],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: typography['4xl'],
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  searchContainer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.xl,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryEmoji: {
    fontSize: typography['5xl'],
    marginRight: spacing.xl,
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tight,
  },
  countryCode: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    fontWeight: typography.semibold,
    letterSpacing: typography.letterSpacing.wider,
  },
  countryCurrency: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  countryLanguages: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: typography.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['4xl'],
  },
  emptyIcon: {
    fontSize: typography['8xl'],
    color: colors.primaryLight,
    marginBottom: spacing['2xl'],
  },
  emptyTitle: {
    fontSize: typography['3xl'],
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
  },
  emptySubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.base,
    marginBottom: spacing['3xl'],
    fontWeight: typography.medium,
  },
  exploreButton: {
    marginTop: spacing.sm,
  },
});

export default FavoritesScreen;
