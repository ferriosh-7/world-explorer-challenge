import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { apolloClient } from './src/services/apollo';
import { FavoritesProvider } from './src/hooks/useFavorites';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={apolloClient}>
        <FavoritesProvider>
          <AppNavigator />
        </FavoritesProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}
