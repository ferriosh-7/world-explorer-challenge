import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { apolloClient } from './src/services/apollo';
import { FavoritesProvider } from './src/hooks/useFavorites';
import { ErrorBoundary } from './src/components';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ApolloProvider client={apolloClient}>
          <FavoritesProvider>
            <AppNavigator />
          </FavoritesProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
