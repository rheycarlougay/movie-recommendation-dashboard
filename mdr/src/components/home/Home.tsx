import { useState, useEffect } from 'react'
import HomeResults from '@/components/home/components/HomeResults'
import SearchResults from '@/components/home/components/SearchResults'
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

interface HomeProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

function Home({ searchQuery }: HomeProps) {
  const [movies, setMovies] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [noResults, setNoResults] = useState(false)

  useEffect(() => {
    setMovies(null)
    setNoResults(false)
  }, [searchQuery])

  return (
    <>
      {noResults ? (
        <div className="no-results">
          <p>No results found</p>
        </div>
      ) : searchQuery === '' ? (
        <HomeResults
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          movies={movies}
          setMovies={setMovies}
          setNoResults={setNoResults}
        />
      ) : (
        <SearchResults
          searchQuery={searchQuery}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          movies={movies}
          setMovies={setMovies}
          setNoResults={setNoResults}
        />
      )}
    </>
  )
}

export default Home