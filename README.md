# World Explorer - React Native App

A React Native app built for Sofía's Frontend Challenge that allows users to explore countries and continents using a GraphQL API.

## Features

- **Navigation Flow**: Home → Continents → Countries → Country Details
- **GraphQL Integration**: Uses Apollo Client to fetch data from the Countries API
- **Favorites System**: Add/remove countries to favorites using AsyncStorage
- **Search Functionality**: Search countries by name
- **Modern UI**: Clean, intuitive interface with proper loading states and error handling

## Technical Stack

- **React Native 0.81.4** (ejected from Expo, native build)
- **TypeScript** for type safety
- **Apollo Client** for GraphQL
- **React Navigation** (Stack Navigator)
- **AsyncStorage** for data persistence
- **Custom UI Components** with consistent theming

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx       # Custom button component
│   ├── Card.tsx         # Card container component
│   ├── FavoriteButton.tsx # Unified favorite button (with variants)
│   ├── SearchInput.tsx  # Search input component
│   ├── LoadingState.tsx # Loading spinner
│   ├── ErrorState.tsx   # Error display component
│   └── index.ts         # Component exports
├── screens/            # Screen components
│   ├── HomeScreen.tsx   # Continents list
│   ├── CountriesScreen.tsx # Countries list (by continent or all)
│   ├── CountryScreen.tsx   # Country details
│   └── FavoritesScreen.tsx # Favorites list
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx # Stack navigator setup
├── services/           # API and data services
│   ├── apollo.ts       # GraphQL client setup
│   ├── queries.ts      # GraphQL queries
│   └── storage.ts      # AsyncStorage utilities
├── hooks/              # Custom hooks
│   ├── useFavorites.tsx # Favorites management
│   └── useDebounce.ts   # Search debouncing
├── theme/              # Design system
│   ├── colors.ts       # Color palette
│   ├── typography.ts   # Typography scale
│   ├── spacing.ts      # Spacing system
│   └── index.ts        # Theme exports
└── types/              # TypeScript type definitions
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install iOS dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```

4. Run on specific platforms:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## API Integration

The app uses the Countries GraphQL API:
- **Endpoint**: https://countries.trevorblades.com/graphql
- **Queries**: Continents, Countries by continent, All countries, Country details

## Features Implementation

### Navigation
- **Home Screen**: Lists all continents with option to view all countries
- **Continents Screen**: Shows countries in selected continent
- **Countries Screen**: Displays countries with search functionality and favorites
- **Country Screen**: Detailed country information with clickable continent navigation

### Favorites System
- Uses AsyncStorage for persistence
- Visual indicators for favorited countries
- Add/remove functionality with context management

### Search & Filtering
- Real-time search by country name
- Filter countries by continent
- Clean, responsive UI with loading states

## Code Quality

- **TypeScript**: Full type safety throughout the application
- **Clean Architecture**: Separation of concerns with services, hooks, and components
- **Error Handling**: Proper error states and user feedback
- **Loading States**: Smooth user experience with loading indicators
- **Responsive Design**: Works on different screen sizes

## Screenshots

The app features:
- Modern, clean UI design
- Intuitive navigation flow
- Search functionality
- Favorites management
- Detailed country information
- Error handling and loading states

## Development Notes

- **Native Build**: Ejected from Expo for native React Native functionality
- **Navigation**: React Navigation Stack Navigator for smooth navigation experience
- **GraphQL**: Apollo Client for efficient data fetching with caching
- **Storage**: AsyncStorage for local data persistence
- **Type Safety**: Full TypeScript implementation for better development experience
- **Performance**: Optimized FlatLists with proper virtualization
- **Accessibility**: Comprehensive accessibility labels and roles
- **Code Quality**: Clean architecture with custom hooks and component patterns

## Future Enhancements

- Offline support with data caching
- Advanced filtering options (by currency, language)
- Country comparison feature
- Maps integration
- Dark mode support
