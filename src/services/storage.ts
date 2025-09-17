import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorite_countries';

export const getFavorites = async (): Promise<string[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};


export const addFavorite = async (countryCode: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(countryCode)) {
      favorites.push(countryCode);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

export const removeFavorite = async (countryCode: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(code => code !== countryCode);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};
