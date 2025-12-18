import axios from 'axios'

// Create axios instance with base configuration
const apiUrl = import.meta.env.VITE_API_HOST

const api = axios.create({
  baseURL: apiUrl, // Adjust this to match your Laravel API URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// API service functions
export const homeApi = {
  // Call the home endpoint
  getMovieTrendings: async (page: number = 1) => {
    try {
      const response = await api.get('/home', {
        params: { page: page }
      })
      return response.data
    } catch (error) {
      console.error('Axios Error: Unable to fetch movie trendings', error)
      throw error
    }
  },
  getMovieSearch: async (searchQuery: string, page: number = 1, isNewSearch: number = 0) => {
    try {
      const response = await api.get('/search', {
        params: { title: searchQuery, page: page, is_new_search: isNewSearch }
      })
      return response.data
    } catch (error) {
      console.error('Axios Error: Unable to fetch movie search results', error)
      throw error
    }
  },
  getMovieDetails: async (movieId: number) => {
    try {
      const response = await api.get(`/movie/${movieId}`)
      return response.data
    } catch (error) {
      console.error('Axios Error: Unable to fetch movie details', error)
      throw error
    }
  },
  getMovieRecommendations: async (genreId: string, excludeMovieId: number) => {
    try {
      const response = await api.get(`/recommendations/${genreId}`, {
        params: {
          exclude_movie_id: excludeMovieId
        }
      })
      return response.data
    } catch (error) {
      console.error('Axios Error: Unable to fetch movie recommendations', error)
      throw error
    }
  }
}

export default api
