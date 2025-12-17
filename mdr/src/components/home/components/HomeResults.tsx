import { useState, useEffect } from 'react'
import { useApi } from '@services/ApiContext'
import { useToast } from '@components/toast/useToast'
import type { Setter } from '@/constants/constants'
import MovieCard from '@/components/home/components/MovieCard'
import '@css/Home.css'

interface MovieData {
  id: number
  title: string
  release_date: string
  poster_path: string
}

interface Movie {
  data: MovieData[],
  total_pages: number
}

interface HomeResultsProps {
  isLoading: boolean,
  setIsLoading: Setter<boolean>,
  movies: Movie | null,
  setMovies: Setter<Movie | null>,
  setNoResults: Setter<boolean>,
}

function HomeResults({ isLoading, setIsLoading, movies, setMovies, setNoResults }: HomeResultsProps) {
  const { getMovieTrendingsApi } = useApi()
  const toast = useToast()

  const [page, setPage] = useState(1)

  const getMovieTrendings = async () => {
    setIsLoading(true)

    try {
      const data = await getMovieTrendingsApi(page)

      if (data.data.length === 0) {
        setMovies(null)
        setNoResults(true)
        return
      }

      setMovies(prev => (!prev || page === 1) ? data : {...prev, data: [...prev.data, ...data.data]})
    } catch (error) {
      console.error('Client Error: Unable to fetch movie trendings', error)
      toast.error('Oops! Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowMore = () => {
    setPage(prev => prev + 1)
  }

  useEffect(() => {
    getMovieTrendings()
  }, [page])

  return (
    <>
      <div className="movies-grid">
        {movies && movies.data.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
      {(isLoading) ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {(movies && movies.total_pages > page) && (
            <div className="pagination-container">
              <button 
                className="btn pagination-button" 
                onClick={handleShowMore}
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default HomeResults
