import { useState, useEffect, useCallback } from 'react';
import { recentSearchesService, RecentSearch } from '../services/recentSearches';

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecentSearches = useCallback(async () => {
    try {
      setLoading(true);
      const searches = await recentSearchesService.getRecentSearchesList();
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error loading recent searches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecentSearch = useCallback(async (
    query: string, 
    type: RecentSearch['type'] = 'general',
    resultCount?: number
  ) => {
    try {
      await recentSearchesService.addRecentSearch(query, type, resultCount);
      await loadRecentSearches(); // Refresh the list
    } catch (error) {
      console.error('Error adding recent search:', error);
    }
  }, [loadRecentSearches]);

  const removeRecentSearch = useCallback(async (id: string) => {
    try {
      await recentSearchesService.removeRecentSearch(id);
      setRecentSearches(prev => prev.filter(search => search.id !== id));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  }, []);

  const clearAllRecentSearches = useCallback(async () => {
    try {
      await recentSearchesService.clearAllRecentSearches();
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }, []);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  return {
    recentSearches,
    loading,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
    refreshRecentSearches: loadRecentSearches,
  };
};
