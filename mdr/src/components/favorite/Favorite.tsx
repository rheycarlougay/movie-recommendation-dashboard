import { useState, useEffect } from 'react'
import { useToast } from '@components/toast/useToast'
import MovieCard from '@/components/home/components/MovieCard'
import '@css/Home.css'

interface MovieData {
  id: number
  title: string
  release_date: string
  poster_path: string
}

interface Movie {
  data: MovieData[]
  total_pages: number
}

interface FavoriteProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

function Favorite() {
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [movies, setMovies] = useState<Movie | null>(null)
  const [page, setPage] = useState(1);
  const [noResults, setNoResults] = useState(false)

  const getFavoritesLocal = () => {
    setIsLoading(true)

    try {
      const stored = localStorage.getItem('favorites')
      if (!stored) {
        setMovies(null)
        setNoResults(true)
        return
      }

      const pages: MovieData[][] = JSON.parse(stored)
      const totalPages = pages.length

      const currentChunk = pages[page - 1] || []

      if (currentChunk.length === 0 && page > 1) {
        setMovies(null)
        setNoResults(true)
        return
      }

      setMovies(prev => {
        if (!prev || page === 1) {
          return { data: currentChunk, total_pages: totalPages }
        } else {
          return { data: [...prev.data, ...currentChunk], total_pages: totalPages }
        }
      })
    } catch (error) {
      console.error('Client Error: Unable to fetch favorites:', error)
      toast.error('Oops! Something went wrong. Please try again later.')
      setMovies(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowMore = () => setPage(prev => prev + 1)

  // Load favorites whenever page changes
  useEffect(() => {
    getFavoritesLocal()
  }, [page])

  return (
    <>
      {noResults ? (
        <div className="no-results">
          <p>No favorites yet</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {movies && movies.data.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            movies && movies.total_pages > page && (
              <div className="pagination-container">
                <button 
                  className="btn pagination-button" 
                  onClick={handleShowMore}
                >
                  Show More
                </button>
              </div>
            )
          )}
        </>
      )}
    </>
  )
}

export default Favorite
