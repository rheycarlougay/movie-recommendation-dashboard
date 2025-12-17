import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Favorite from '@/components/favorite/Favorite'

// ✅ Mock useToast so it DOES NOT throw
vi.mock('@components/toast/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    showToast: vi.fn(),
  }),
}))

describe('Favorite component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows "No favorites yet" when localStorage is empty', () => {
    render(<Favorite />)

    expect(screen.getByText('No favorites yet')).toBeTruthy()
  })

  it('renders favorite movies from localStorage', () => {
    const favorites = [
      [
        {
          id: 1,
          title: 'Inception',
          release_date: '2010-07-16',
          poster_path: '/inception.jpg',
        },
      ],
    ]

    localStorage.setItem('favorites', JSON.stringify(favorites))

    render(<Favorite />)

    expect(screen.getByText('Inception')).toBeTruthy()
  })
})
