import { useState } from 'react'
import MovieDetail from './MovieDetail'
import '@css/Home.css'

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
}

interface MovieCardProps {
  movie: Movie
  onMovieSelect?: (movieId: number) => void
}

function MovieCard({ movie, onMovieSelect }: MovieCardProps) {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)

  const handleClick = async () => {
    handleCloseDetail()

    // if clicking movie card comes from recommendations
    if (onMovieSelect) {
      onMovieSelect(movie.id)
    } else {
      setSelectedMovieId(movie.id)
    }
  }

  // this will open the latest movie card clicked
  const handleOpenDetail = (newMovieId: number) => {
    setTimeout(() => {
      setSelectedMovieId(newMovieId)
    }, 300)
  }

  const handleCloseDetail = () => {
    setSelectedMovieId(null)
  }

  return (
    <>
      <div className="movie-card" onClick={handleClick}>
        <div className="movie-image">
          {!movie.poster_path.includes('/null') ? (
            <img src={movie.poster_path} alt={movie.title} />
          ) : (
            <div className="no-image">
              <p>No image available</p>
            </div>
          )}
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Coming soon'}
          </p>
        </div>
      </div>
      {selectedMovieId && (
        <MovieDetail 
          movieId={selectedMovieId}
          movieData={movie}
          onClose={handleCloseDetail}
          onMovieSelect={handleOpenDetail}
        />
      )}
    </>
  )
}

export default MovieCard
