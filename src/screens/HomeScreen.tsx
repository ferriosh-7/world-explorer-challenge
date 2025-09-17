import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Continent, ContinentsResponse } from '../types';
import { GET_CONTINENTS } from '../services/queries';
import { useFavorites } from '../hooks/useFavorites';
import { Button, Card, FavoriteButton, LoadingState, ErrorState } from '../components';
import { colors, typography, spacing } from '../theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { favorites } = useFavorites();
  const { data, loading, error } = useQuery<ContinentsResponse>(GET_CONTINENTS);

  const handleContinentPress = useCallback((continent: Continent) => {
    navigation.navigate('Countries', { continentCode: continent.code });
  }, [navigation]);

  const handleViewAllCountries = useCallback(() => {
    navigation.navigate('Countries', {});
  }, [navigation]);

  const handleViewFavorites = useCallback(() => {
    navigation.navigate('Favorites');
  }, [navigation]);

  const renderContinent = useCallback(({ item }: { item: Continent }) => (
    <Card 
      onPress={() => handleContinentPress(item)}
      accessibilityLabel={`View countries in ${item.name}`}
      accessibilityHint={`Navigate to countries in ${item.name} continent`}
    >
      <Text style={styles.continentName}>{item.name}</Text>
      <Text style={styles.continentCode}>{item.code}</Text>
    </Card>
  ), [handleContinentPress]);

  const continents = useMemo(() => data?.continents || [], [data?.continents]);

  if (loading) {
    return <LoadingState message="Loading continents..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading continents"
        message={error.message}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Explore the World</Text>
            <Text style={styles.subtitle}>Select a continent to view countries</Text>
          </View>
          <FavoriteButton
            isFavorite={favorites.length > 0}
            onPress={handleViewFavorites}
            count={favorites.length}
          />
        </View>
      </View>
      
      <FlatList
        data={continents}
        renderItem={renderContinent}
        keyExtractor={(item) => item.code}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 80, // Approximate item height
          offset: 80 * index,
          index,
        })}
      />
      
      <View style={styles.buttonContainer}>
        <Button
          title="View All Countries"
          onPress={handleViewAllCountries}
          variant="primary"
          accessibilityLabel="View all countries"
          accessibilityHint="Navigate to view all countries from all continents"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: typography['3xl'],
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
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'android' ? spacing.sm : 0,
  },
  continentName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tight,
  },
  continentCode: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: typography.semibold,
    letterSpacing: typography.letterSpacing.wider,
  },
  buttonContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingVertical: Platform.OS === 'android' ? spacing.lg : spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default memo(HomeScreen);
