Movie Discovery & Favorites System

This web application allows users to explore trending movies, search for specific titles, view detailed movie information, and manage a list of favorite movies. The project is divided into two main components:

- Frontend: mdr
- Backend: mdr-api

---

Prerequisites

Before running the project, ensure the following are installed on your system:

- PHP v8 or higher
- MySQL v8 or higher
- Node.js v22 or higher
- npm v11 or higher

---

Installation

Frontend (mdr)

Navigate to the mdr folder and run:

npm install

Backend (mdr-api)

Navigate to the mdr-api folder and run:

composer install
php artisan migrate
php artisan key:generate

---

Running Tests

Frontend:

npm run test

Backend:

php artisan test

---

Application Overview

The system contains three main views: Home, Favorites, and Movie Details.

Home Page

- Displays trending movies for the current day.
- Pagination shows 20 results per page.
- Provides a search feature that displays 5 results per page.
- Search limit: Users can perform up to 5 searches per minute.

Favorites Page

- Displays all movies marked as favorites by the user.

Movie Details

Clicking a movie card opens the Movie Details view, which includes:

- Movie title
- Trailer
- Poster image
- Plot summary
- Rating
- Genre tags
- Favorite button (add or remove from favorites)
- Recommendations: Related movies based on the primary genre of the selected movie

---

Third-Party API Keys

To use the system, generate API keys from the following services:

- TMDB: https://www.themoviedb.org/settings/api
- OMDB: https://www.omdbapi.com/apikey.aspx
- YouTube: https://developers.google.com/youtube/v3/getting-started

After gathering all the keys set them up at your .env with this designated key name

- TMDB: TMDB_API_KEY = "<your_api_key>"
- OMDB: OMDB_API_KEY = "<your_api_key>"
- YouTube: YOUTUBE_API_KEY = "<your_api_key>"

---

Notes

- Ensure the backend (mdr-api) is running before using the frontend.
- Cached API responses improve performance for searches and trending movies.
- Favorites are stored in local storage to persist between sessions.