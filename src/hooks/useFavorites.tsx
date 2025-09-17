import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FavoritesContextType } from '../types';
import { getFavorites, addFavorite as addFavoriteStorage, removeFavorite as removeFavoriteStorage } from '../services/storage';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const savedFavorites = await getFavorites();
    setFavorites(savedFavorites);
  };

  const addFavorite = async (countryCode: string) => {
    await addFavoriteStorage(countryCode);
    setFavorites(prev => [...prev, countryCode]);
  };

  const removeFavorite = async (countryCode: string) => {
    await removeFavoriteStorage(countryCode);
    setFavorites(prev => prev.filter(code => code !== countryCode));
  };

  const isFavorite = (countryCode: string) => {
    return favorites.includes(countryCode);
  };

  const value: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
