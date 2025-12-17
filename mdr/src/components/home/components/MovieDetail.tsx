import { useState, useEffect } from 'react'
import { useApi } from '@services/ApiContext'
import { useToast } from '@components/toast/useToast'
import { FAVORITES_KEY, MAX_PER_PAGE } from '@/constants/constants'
import MovieCard from './MovieCard'
import '@css/Home.css'

interface Genre {
  id: string
  name: string
}

interface MovieDetailData {
  id: number
  title: string
  poster_path: string
  genres: Genre[]
  overview: string
  rating: string
  trailer: string | null
  imdb_id: string
}

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
}

interface MovieDetailProps {
  movieId: number
  movieData: Movie
  onClose: () => void
  onMovieSelect?: (movieId: number) => void
}

function MovieDetail({ movieId, movieData, onClose, onMovieSelect }: MovieDetailProps) {
  const { getMovieDetailsApi, getMovieRecommendationsApi } = useApi()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [movie, setMovie] = useState<MovieDetailData | null>(null)
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)

  // Check if movie exists in paginated favorites
  const checkIsFavorite = (movieId: number): boolean => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (!stored) return false

    const pages: Movie[][] = JSON.parse(stored)
    return pages.some(page => page.some(m => m.id === movieId))
  }

  // Add movie to favorites in paginated array
  const addFavoriteToLocalStorage = (movie: Movie) => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    let pages: Movie[][] = stored ? JSON.parse(stored) : []

    if (pages.length === 0) pages.push([]) // ensure at least one page

    let remaining = [movie]

    while (remaining.length > 0) {
      let lastPage = pages[pages.length - 1]
      const spotsLeft = MAX_PER_PAGE - lastPage.length

      if (spotsLeft > 0) {
        lastPage.push(...remaining.splice(0, spotsLeft))
      }

      if (lastPage.length >= MAX_PER_PAGE && remaining.length > 0) {
        pages.push([])
      }
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(pages))
  }

  // Remove movie from favorites and re-chunk pages
  const removeFavoriteFromLocalStorage = (movieId: number) => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (!stored) return

    // Flatten all pages into a single array
    let allMovies: Movie[] = JSON.parse(stored).flat()

    // Remove the movie
    allMovies = allMovies.filter(m => m.id !== movieId)

    // Re-chunk into pages of MAX_PER_PAGE
    const pages: Movie[][] = []
    for (let i = 0; i < allMovies.length; i += MAX_PER_PAGE) {
      pages.push(allMovies.slice(i, i + MAX_PER_PAGE))
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(pages))
  }

  const getMovieDetails = async () => {
    setIsLoading(true)

    try {
      const data = await getMovieDetailsApi(movieId)
      setMovie(data)
      setIsFavorite(checkIsFavorite(movieId))

      if (data.genres.length > 0) getMovieRecommendations(data.genres[0].id, data.id)
    } catch (error) {
      console.error('Client Error: Unable to fetch movie details:', error)
      toast.error('Oops! Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const getMovieRecommendations = async (genreId: string, excludeMovieId: number) => {
    setIsLoadingRecommendations(true)

    try {
      const data = await getMovieRecommendationsApi(genreId, excludeMovieId)
      setRecommendations(data.data)
    } catch (error) {
      console.error('Client Error: Unable to fetch movie recommendations:', error)
      toast.error('Oops! Something went wrong. Please try again later.')
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const updateFavoriteStatus = () => {
    setIsLoadingFavorite(true)
    
    try {
      if (!isFavorite) {
        addFavoriteToLocalStorage(movieData)
        setIsFavorite(true)
      } else {
        removeFavoriteFromLocalStorage(movieId)
        setIsFavorite(false)
      }
    } catch (error) {
      console.error('Unable to update favorite status', error)
      toast.error('Oops! Something went wrong. Please try again later.')
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  const handleFavoriteStatus = () => {
    updateFavoriteStatus()
  }

  useEffect(() => {
    getMovieDetails()
  }, [movieId])

  return (
    <>
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading movie details...</p>
        </div>
      ) : (
        <>
          {movie && (
            <div className="movie-detail-overlay" onClick={onClose}>
              <div className="movie-detail-container" onClick={e => e.stopPropagation()}>
                <button className="movie-detail-close" onClick={onClose} aria-label="Close">
                  <span className="close-icon">×</span>
                </button>

                <div className="movie-detail-content">
                  <h1 className="movie-detail-title">{movie.title}</h1>
                  <div className="movie-detail-video">
                    <h3 className="video-title">Trailer</h3>
                    <div className="video-container">
                      {movie.trailer ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1&mute=1`}
                          title="Movie Trailer"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="no-trailer-message">
                          <p>No trailer available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="movie-detail-bottom-section">
                    <div className="movie-detail-left-column">
                      <div className="movie-detail-image">
                        <img src={movie.poster_path} alt={movie.title} />
                      </div>

                      <button
                        className={`movie-detail-bookmark ${isFavorite ? 'bookmark-yellow' : ''}`}
                        onClick={handleFavoriteStatus}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        disabled={isLoadingFavorite}
                      >
                        {isLoadingFavorite ? (
                          <span>Loading...</span>
                        ) : (
                          <>
                            <span className="bookmark-icon">{isFavorite ? '✓' : '★'}</span>
                            <span className="bookmark-text">{isFavorite ? 'Added to Favorites' : 'Add to Favorites'}</span>
                          </>
                        )}
                      </button>

                      <div className="movie-detail-rating">
                        <span className="rating-label">Rating:</span>
                        <span className={movie.rating === 'N/A' ? 'rating-value na-text' : 'rating-value'}>
                          {movie.rating === 'N/A' ? 'N/A' : `${movie.rating}/10`}
                        </span>
                      </div>

                      <div className="movie-detail-genre">
                        <span className="genre-label-text">Genre:</span>
                        <div className="genre-tags">
                          {movie.genres.length > 0 ? (
                            movie.genres.map((genre, index) => (
                              <span key={index} className="genre-tag">
                                {genre.name}
                              </span>
                            ))
                          ) : (
                            <span className="rating-value na-text">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="movie-detail-plot">
                      <h3 className="plot-title">Plot Summary</h3>
                      <p className="plot-text">{movie.overview}</p>
                    </div>
                  </div>

                  <div className="movie-detail-recommendations">
                    <h3 className="recommendations-title">You may also like this</h3>
                    {isLoadingRecommendations ? (
                      <div className="recommendations-loading">
                        <div className="loading-spinner"></div>
                      </div>
                    ) : recommendations.length > 0 ? (
                      <div className="recommendations-grid">
                        {recommendations.map(recMovie => (
                          <MovieCard key={recMovie.id} movie={recMovie} onMovieSelect={onMovieSelect} />
                        ))}
                      </div>
                    ) : (
                      <div className="no-recommendations">
                        <p>No recommendations yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default MovieDetail
