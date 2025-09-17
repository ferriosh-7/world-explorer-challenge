import React, { useState, memo, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CountryListItem, CountriesResponse } from '../types';
import { GET_COUNTRIES_BY_CONTINENT, GET_ALL_COUNTRIES } from '../services/queries';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';
import { Card, SearchInput, FavoriteButton, CountryFavoriteButton, LoadingState, ErrorState } from '../components';
import { colors, typography, spacing } from '../theme';

type CountriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Countries'>;
type CountriesScreenRouteProp = RouteProp<RootStackParamList, 'Countries'>;

const CountriesScreen = memo(() => {
  const navigation = useNavigation<CountriesScreenNavigationProp>();
  const route = useRoute<CountriesScreenRouteProp>();
  const { continentCode } = route.params || {};
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, loading, error } = useQuery<CountriesResponse>(
    continentCode ? GET_COUNTRIES_BY_CONTINENT : GET_ALL_COUNTRIES,
    {
      variables: continentCode ? { continentCode } : undefined,
    }
  );

  const handleCountryPress = useCallback((country: CountryListItem) => {
    navigation.navigate('Country', { countryCode: country.code });
  }, [navigation]);

  const handleFavoritePress = useCallback(async (countryCode: string) => {
    if (isFavorite(countryCode)) {
      await removeFavorite(countryCode);
    } else {
      await addFavorite(countryCode);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const handleViewFavorites = useCallback(() => {
    navigation.navigate('Favorites');
  }, [navigation]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const countries = useMemo(() => data?.countries || [], [data?.countries]);

  const filteredCountries = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return countries;
    
    return countries.filter((country: CountryListItem) => {
      const query = debouncedSearchQuery.toLowerCase();
      const matchesName = country.name.toLowerCase().includes(query);
      const matchesLanguage = country.languages?.some(lang => 
        lang.name.toLowerCase().includes(query)
      );
      return matchesName || matchesLanguage;
    });
  }, [countries, debouncedSearchQuery]);

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
        isFavorite={isFavorite(item.code)}
        onPress={() => handleFavoritePress(item.code)}
      />
    </Card>
  ), [handleCountryPress, handleFavoritePress, isFavorite]);

  if (loading) {
    return <LoadingState message="Loading countries..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading countries"
        message={error.message}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search countries or languages..."
            onClear={handleSearchClear}
          />
        </View>
        <View style={styles.favoriteButtonContainer}>
          <FavoriteButton
            isFavorite={favorites.length > 0}
            onPress={handleViewFavorites}
            count={favorites.length}
          />
        </View>
      </View>
      
      <FlatList
        data={filteredCountries}
        renderItem={renderCountry}
        keyExtractor={(item) => item.code}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  searchContainer: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInputContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  favoriteButtonContainer: {
    flexShrink: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.xl,
  },
  countryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default CountriesScreen;
