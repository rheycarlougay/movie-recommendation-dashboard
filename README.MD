Movie Discovery & Favorites System
===

Overview

The Movie Discovery & Favorites System is a web application that allows users to browse trending movies, search for specific titles, view detailed movie information, and manage a personal list of favorite movies.

The project is composed of two main components:
1) Frontend (mdr) – Handles the user interface and user interactions
2) Backend (mdr-api) – Provides the API, data processing, and business logic

---

Prerequisites

Before setting up the project, ensure the following software is installed on your system:
1) PHP version 8 or higher
2) MySQL version 8 or higher
3) Node.js version 22 or higher
4) npm version 11 or higher

---

Installation

Frontend Setup (mdr)

1) Navigate to the mdr directory
2) Install the required dependencies by running:

npm install

---

Backend Setup (mdr-api)

1) Navigate to the mdr-api directory
2) Install dependencies and initialize the application by running the following commands in order:

composer install
php artisan key:generate
php artisan migrate

---

Running Tests

Frontend

To run frontend tests, execute:

npm run test

Backend

To run backend tests, execute:

php artisan test

---

Environment Configuration

To ensure proper communication between the frontend and backend, environment variables must be configured.

Frontend (.env file in the mdr directory):
VITE_API_HOST="<your_client_host>"

Backend (.env file in the mdr-api directory):
CLIENT_HOST="<your_client_host>"

---

Third-Party API Keys

This project relies on external services for movie data and media content. API keys must be generated from the following providers:
1) TMDB – https://www.themoviedb.org/settings/api
2) OMDB – https://www.omdbapi.com/apikey.aspx
3) YouTube – https://developers.google.com/youtube/v3/getting-started

After generating the keys, add them to the backend .env file (mdr-api) using the following variable names:

TMDB_API_KEY="<your_api_key>"
OMDB_API_KEY="<your_api_key>"
YOUTUBE_API_KEY="<your_api_key>"

---

Once all setup steps are complete, run the following commands in your terminal. Make sure your terminal’s current directory is the project’s root folder.

Frontend

npm run dev

Backend

php artisan serve

---

Application Features

The application consists of three main views: Home, Favorites, and Movie Details.

Home

The Home view provides the following functionality:
1) Displays trending movies for the current day
2) Uses pagination with 20 movies per page
3) Includes a search feature displaying 5 results per page
4) Limits search requests to a maximum of 5 searches per minute per user

---

Favorites

The Favorites view provides the following functionality:
1) Displays all movies marked as favorites by the user
2) Stores favorite movies locally to persist between browser sessions

---

Movie Details

Selecting a movie opens the Movie Details view, which includes:
1) Movie title
2) Trailer
3) Poster image
4) Plot summary
5) Rating
6) Genre tags
7) Favorite button to add or remove the movie from favorites
8) Movie recommendations based on the selected movie’s primary genre

---

Notes

1) Ensure the backend (mdr-api) is running before accessing the frontend
2) Cached API responses are used to improve performance for trending movies and searches
3) Favorite movies are stored in browser local storage and persist between sessions