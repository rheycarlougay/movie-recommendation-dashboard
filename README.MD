Movie Discovery & Favorites System

This project is a web application that allows users to explore trending movies, search for specific movies, view detailed information, and manage a list of favorite movies. It consists of two main components: the frontend (mdr) and the backend (mdr-api).

---

Prerequisites

Before running the project, ensure the following are installed on your device:

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

The system consists of three main views: Home, Favorites, and Movie Details.

Home Page

- Displays trending movies for the current day.
- Pagination shows 20 results per page.
- Provides a search feature that displays 5 results per page.
- Search limitation: Users can perform up to 5 searches per minute.

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

Notes

- Ensure the backend (mdr-api) is running before using the frontend.
- Cached API responses help improve performance for searches and trending movies.
- The system uses local storage to maintain favorites between sessions.