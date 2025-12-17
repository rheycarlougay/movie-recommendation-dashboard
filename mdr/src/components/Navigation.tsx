import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import '@css/Home.css'

interface NavigationProps {
  searchQuery?: string
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

function Navigation({ searchQuery = '', onSearchKeyDown }: NavigationProps) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [inputValue, setInputValue] = useState(searchQuery)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  return (
    <nav className="top-menu">
      <div className="menu-container">
        {isHomePage && onSearchKeyDown && (
          <input
            type="text"
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onSearchKeyDown}
            className="search-field"
          />
        )}
        <div className="menu-items">
          <NavLink to="/" className="menu-item">Home</NavLink>
          <NavLink to="/favorite" className="menu-item">Favorite</NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
