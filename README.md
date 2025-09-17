# World Explorer - React Native App

A React Native app built for Sofía's Frontend Challenge that allows users to explore countries and continents using a GraphQL API.

## Features

- **Navigation Flow**: Home → Continents → Countries → Country Details
- **GraphQL Integration**: Uses Apollo Client to fetch data from the Countries API
- **Favorites System**: Add/remove countries to favorites using AsyncStorage
- **Search Functionality**: Search countries by name
- **Modern UI**: Clean, intuitive interface with proper loading states and error handling

## Technical Stack

- **React Native** (Expo managed workflow)
- **TypeScript** for type safety
- **Apollo Client** for GraphQL
- **React Navigation** for navigation
- **AsyncStorage** for data persistence
- **React Native Elements** for UI components

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── ContinentsScreen.tsx
│   ├── CountriesScreen.tsx
│   └── CountryScreen.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── services/           # API and data services
│   ├── apollo.ts       # GraphQL client setup
│   ├── queries.ts      # GraphQL queries
│   └── storage.ts      # AsyncStorage utilities
├── hooks/              # Custom hooks
│   └── useFavorites.ts # Favorites management
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    └── constants.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on specific platforms:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
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

- Built with Expo for easy development and deployment
- Uses React Navigation for smooth navigation experience
- Apollo Client for efficient GraphQL data fetching
- AsyncStorage for local data persistence
- TypeScript for better development experience and code quality

## Future Enhancements

- Offline support with data caching
- Advanced filtering options (by currency, language)
- Country comparison feature
- Maps integration
- Dark mode support
