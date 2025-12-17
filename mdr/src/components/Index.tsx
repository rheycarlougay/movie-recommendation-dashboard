import { useState } from 'react'
import Navigation from '@components/Navigation'
import Content from '@components/Content'
import '@css/Home.css'

function Index() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newQuery = e.currentTarget.value.trim()
      if (newQuery !== searchQuery) {
        setSearchQuery(newQuery)
      }
    }
  }

  return (
    <div className="home-page">
      <Navigation 
        searchQuery={searchQuery} 
        onSearchKeyDown={handleSearchKeyDown}
      />
      <Content searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  )
}

export default Index
