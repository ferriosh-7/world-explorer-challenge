import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import CountriesScreen from '../screens/CountriesScreen';
import CountryScreen from '../screens/CountryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            letterSpacing: -0.3,
            textAlign: 'center',
          },
          headerTitleAlign: 'center',
        }}
      >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
        <Stack.Screen 
          name="Countries" 
          component={CountriesScreen} 
          options={{ 
            title: 'Countries',
            headerBackTitle: ''
          }}
        />
        <Stack.Screen 
          name="Country" 
          component={CountryScreen} 
          options={{ 
            title: 'Country Details',
            headerBackTitle: ''
          }}
        />
        <Stack.Screen 
          name="Favorites" 
          component={FavoritesScreen} 
          options={{ 
            title: 'My Favorites',
            headerBackTitle: ''
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
