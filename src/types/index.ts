import { ParamListBase } from '@react-navigation/native';

export interface Continent {
  code: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
  emoji: string;
  currency: string;
  continent: Continent;
  languages: Language[];
}

// Alias for consistency with GraphQL response naming
export type CountryListItem = Country;

export interface RootStackParamList extends ParamListBase {
  Home: undefined;
  Countries: { continentCode?: string };
  Country: { countryCode: string };
  Favorites: undefined;
}

export interface FavoritesContextType {
  favorites: string[];
  addFavorite: (countryCode: string) => void;
  removeFavorite: (countryCode: string) => void;
  isFavorite: (countryCode: string) => boolean;
}

// GraphQL Response Types
export interface ContinentsResponse {
  continents: Continent[];
}

export interface CountriesResponse {
  countries: CountryListItem[];
}

export interface CountryResponse {
  country: Country;
}
