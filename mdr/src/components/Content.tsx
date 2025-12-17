import { Routes, Route } from 'react-router-dom'
import Home from '@/components/home/Home'
import Favorite from '@/components/favorite/Favorite'

interface ContentProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

function Content({ searchQuery, setSearchQuery }: ContentProps) {
  return (
    <div className="home-content">
      <Routes>
        <Route 
          path="/" 
          element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} 
        />
        <Route 
          path="/favorite" 
          element={<Favorite />} 
        />
      </Routes>
    </div>
  )
}

export default Content
