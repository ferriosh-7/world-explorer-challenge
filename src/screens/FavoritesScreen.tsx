import React, { useState, memo, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useQuery } from '@apollo/client/react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CountryListItem } from '../types';
import { GET_ALL_COUNTRIES } from '../services/queries';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { Card, SearchInput, FavoriteButton, LoadingState, ErrorState, Button, SearchEmptyState, FavoritesEmptyState } from '../components';
import { colors, typography, spacing } from '../theme';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

const FavoritesScreen = memo(() => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, removeFavorite, isFavorite } = useFavorites();
  const { addRecentSearch } = useRecentSearches();
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

  const handleSearchSubmit = useCallback((query: string) => {
    // We'll add the search after the user submits, result count will be updated later
    addRecentSearch(query, 'country');
  }, [addRecentSearch]);

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
      <FavoriteButton
        isFavorite={true}
        onPress={() => handleFavoritePress(item.code)}
        variant="compact"
      />
    </Card>
  ), [handleCountryPress, handleFavoritePress]);

  const renderEmptyState = () => {
    const isSearching = searchQuery.length > 0;
    
    if (isSearching) {
      return (
        <SearchEmptyState
          searchQuery={searchQuery}
          onClear={handleSearchClear}
        />
      );
    }
    
    return (
      <FavoritesEmptyState
        onExplore={() => navigation.navigate('Home')}
      />
    );
  };

  if (loading) {
    return <LoadingState message="Loading favorites..." variant="skeleton-countries" itemCount={8} />;
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
            onSubmit={handleSearchSubmit}
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
        getItemLayout={(_, index) => ({
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
    fontSize: typography.fontSize.h2,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.fontSize.body1,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
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
    fontSize: typography.fontSize.h1,
    marginRight: spacing.xl,
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: typography.fontSize.h6,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tight,
  },
  countryCode: {
    fontSize: typography.fontSize.body2,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.wider,
  },
  countryCurrency: {
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  countryLanguages: {
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: typography.weight.medium,
  },
});

export default FavoritesScreen;
