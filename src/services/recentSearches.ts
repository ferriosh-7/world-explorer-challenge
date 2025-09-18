import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 10;

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
  type: 'country' | 'general';
  resultCount?: number;
}

class RecentSearchesService {
  private async getRecentSearches(): Promise<RecentSearch[]> {
    try {
      const data = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (data) {
        const searches = JSON.parse(data) as RecentSearch[];
        // Sort by timestamp (most recent first)
        return searches.sort((a, b) => b.timestamp - a.timestamp);
      }
      return [];
    } catch (error) {
      console.error('Error loading recent searches:', error);
      return [];
    }
  }

  private async saveRecentSearches(searches: RecentSearch[]): Promise<void> {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  }

  async addRecentSearch(
    query: string, 
    type: RecentSearch['type'] = 'general',
    resultCount?: number
  ): Promise<void> {
    if (!query.trim()) return;

    const searches = await this.getRecentSearches();
    
    // Remove existing search with same query (case-insensitive)
    const filteredSearches = searches.filter(
      search => search.query.toLowerCase() !== query.toLowerCase()
    );

    // Add new search at the beginning
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: Date.now(),
      type,
      resultCount,
    };

    const updatedSearches = [newSearch, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);
    await this.saveRecentSearches(updatedSearches);
  }

  async getRecentSearchesList(): Promise<RecentSearch[]> {
    return this.getRecentSearches();
  }

  async removeRecentSearch(id: string): Promise<void> {
    const searches = await this.getRecentSearches();
    const filteredSearches = searches.filter(search => search.id !== id);
    await this.saveRecentSearches(filteredSearches);
  }

  async clearAllRecentSearches(): Promise<void> {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }

  async getPopularSearches(): Promise<string[]> {
    const searches = await this.getRecentSearches();
    
    // Count frequency of searches (case-insensitive)
    const queryCount = new Map<string, number>();
    searches.forEach(search => {
      const normalizedQuery = search.query.toLowerCase();
      queryCount.set(normalizedQuery, (queryCount.get(normalizedQuery) || 0) + 1);
    });

    // Sort by frequency and return top 5
    return Array.from(queryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query]) => query);
  }
}

export const recentSearchesService = new RecentSearchesService();
