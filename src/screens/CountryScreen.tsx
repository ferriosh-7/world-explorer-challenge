import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Country, CountryResponse } from '../types';
import { GET_COUNTRY_DETAILS } from '../services/queries';
import { useFavorites } from '../hooks/useFavorites';
import { FavoriteButton, LoadingState, ErrorState } from '../components';
import { colors, typography, spacing } from '../theme';

type CountryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Country'>;
type CountryScreenRouteProp = RouteProp<RootStackParamList, 'Country'>;

const CountryScreen = memo(() => {
  const navigation = useNavigation<CountryScreenNavigationProp>();
  const route = useRoute<CountryScreenRouteProp>();
  const { countryCode } = route.params;
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const { data, loading, error } = useQuery<CountryResponse>(GET_COUNTRY_DETAILS, {
    variables: { code: countryCode },
  });

  const country: Country | undefined = data?.country;

  const handleContinentPress = useCallback(() => {
    if (country?.continent) {
      navigation.navigate('Countries', { continentCode: country.continent.code });
    }
  }, [navigation, country?.continent]);

  const handleFavoritePress = useCallback(async () => {
    if (isFavorite(countryCode)) {
      await removeFavorite(countryCode);
    } else {
      await addFavorite(countryCode);
    }
  }, [isFavorite, addFavorite, removeFavorite, countryCode]);

  if (loading) {
    return <LoadingState message="Loading country details..." variant="skeleton-detail" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading country details"
        message={error.message}
      />
    );
  }

  if (!country) {
    return (
      <ErrorState
        title="Country not found"
        message="The requested country could not be found"
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <FavoriteButton
            isFavorite={isFavorite(countryCode)}
            onPress={handleFavoritePress}
            variant="compact"
          />
        </View>
        <Text style={styles.emoji}>{country.emoji}</Text>
        <Text style={styles.name}>{country.name}</Text>
        <Text style={styles.code}>{country.code}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Continent</Text>
          <TouchableOpacity 
            onPress={handleContinentPress}
            accessibilityLabel={`View countries in ${country.continent.name}`}
            accessibilityRole="button"
          >
            <Text style={styles.detailValueLink}>{country.continent.name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Currency</Text>
          <Text style={styles.detailValue}>{country.currency || 'N/A'}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Languages</Text>
          <View style={styles.languagesContainer}>
            {country.languages.map((language) => (
              <View key={language.code} style={styles.languageItem}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageCode}>({language.code})</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: spacing['3xl'],
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: typography.fontSize.display1,
    marginBottom: spacing.xl,
  },
  name: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
  },
  code: {
    fontSize: typography.fontSize.body1,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing['2xl'],
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.wider,
  },
  detailsContainer: {
    padding: spacing['2xl'],
  },
  detailItem: {
    backgroundColor: colors.surface,
    padding: spacing['2xl'],
    marginBottom: spacing.xl,
    borderRadius: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  detailLabel: {
    fontSize: typography.fontSize.h6,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: typography.letterSpacing.tight,
  },
  detailValue: {
    fontSize: typography.fontSize.body1,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  detailValueLink: {
    fontSize: typography.fontSize.body1,
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: typography.weight.semibold,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  languageItem: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageName: {
    fontSize: typography.fontSize.body2,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  languageCode: {
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xs,
  },
});

export default CountryScreen;
