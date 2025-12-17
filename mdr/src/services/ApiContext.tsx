import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { homeApi } from '@services/api';

interface ApiContextType {
  getMovieTrendingsApi: (page: number) => Promise<any>;
  getMovieSearchApi: (searchQuery: string, page: number, isNewSearch: number) => Promise<any>;
  getMovieDetailsApi: (movieId: number) => Promise<any>;
  getMovieRecommendationsApi: (genreId: string, excludeMovieId: number) => Promise<any>;
}

const ApiContext = createContext<ApiContextType>({
  getMovieTrendingsApi: async () => Promise.reject('No provider'),
  getMovieSearchApi: async () => Promise.reject('No provider'), 
  getMovieDetailsApi: async () => Promise.reject('No provider'),
  getMovieRecommendationsApi: async () => Promise.reject('No provider'),
});

// Provider component
export const ApiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ApiContext.Provider
      value={{
        getMovieTrendingsApi: homeApi.getMovieTrendings,
        getMovieSearchApi: homeApi.getMovieSearch,
        getMovieDetailsApi: homeApi.getMovieDetails,
        getMovieRecommendationsApi: homeApi.getMovieRecommendations,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook for easier usage
export const useApi = () => useContext(ApiContext);
