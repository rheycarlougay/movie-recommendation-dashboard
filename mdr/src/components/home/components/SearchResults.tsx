import { useState, useEffect } from 'react'
import { useApi } from '@services/ApiContext'
import { useToast } from '@components/toast/useToast'
import axios from 'axios'
import MovieCard from './MovieCard'
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

interface SearchResultsProps {
  searchQuery: string
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  movies: Movie | null
  setMovies: React.Dispatch<React.SetStateAction<Movie | null>>
  setNoResults: React.Dispatch<React.SetStateAction<boolean>>
}

function SearchResults({ searchQuery, isLoading, setIsLoading, movies, setMovies, setNoResults }: SearchResultsProps) {
  const { getMovieSearchApi } = useApi()
  const toast = useToast()

  const [page, setPage] = useState(1)

  const getMovieSearch = async (currentPage: number, isNewSearch: number = 0) => {
    setIsLoading(true)

    try {
      const data = await getMovieSearchApi(searchQuery, currentPage, isNewSearch)

      if (data.data.length === 0) {
        setMovies(null)
        setNoResults(true)
      } else {
        setMovies(data)
        setNoResults(false)
      }
    } catch (error) {
      if(axios.isAxiosError(error) && error.response?.status === 429) {
        console.log('Rate limit reached. Please wait a moment.')
        toast.error('You have reached the maximum number of searches per minute. Please try again later.')
        return;
      }

      console.error('Client Error: Unable to fetch movie search results', error)
      toast.error('Oops! Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!searchQuery) return

    setPage(1)
    getMovieSearch(1, 1)
  }, [searchQuery])

  useEffect(() => {
    getMovieSearch(page)
  }, [page])

  const handlePreviousPage = () => {
    setPage(page - 1)
  }

  const handleNextPage = () => {
    setPage(page + 1)
  }

  return (
    <>
      {!isLoading ? (
        <div className="movies-grid">
          {movies && movies.data.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {movies && (
        <div className="pagination-container">
          <button className="btn pagination-button" onClick={handlePreviousPage} disabled={page === 1 || isLoading}>
            Previous
          </button>
          <span className="pagination-page">Page {page}</span>
          <button className="btn pagination-button" onClick={handleNextPage} disabled={page === movies.total_pages || isLoading}>
            Next
          </button>
        </div>
      )}
    </>
  )
}

export default SearchResults