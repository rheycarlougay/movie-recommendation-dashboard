<?php

namespace App\Http\Controllers;

use App\Services\TmdbService;
use App\Services\OmdbService;
use App\Services\YoutubeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use App\Models\UserSearchLog;

class HomeController extends Controller
{
    protected $tmdbService;
    protected $omdbService;
    protected $youtubeService;

    public function __construct(TmdbService $tmdbService, OmdbService $omdbService, YoutubeService $youtubeService)
    {
        $this->tmdbService = $tmdbService;
        $this->omdbService = $omdbService; 
        $this->youtubeService = $youtubeService;
    }

    public function index(Request $request)
    {
        try {
            $page = $request->input('page', 1);

            if (empty($page) && !is_numeric($page) || $page < 1) {
                $errorData = [
                    'error' => 'Server Error: Page must be a positive integer',
                    'status' => 400,
                    'message' => 'Page must be a positive integer'
                ];

                return $this->handleError($errorData, 400);
            }

            $configResponse = $this->tmdbService->get("configuration");
            $trendingResponse = $this->tmdbService->get("trending/movie/day", [
                'page' => $page
            ]);

            if (!$configResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch configuration from TMDB API',
                    'status' => $configResponse->status(),
                    'message' => $configResponse->body()
                ];

                return $this->handleError($errorData, $configResponse->status());
            }
            
            if (!$trendingResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch trending movies from TMDB API',
                    'status' => $trendingResponse->status(),
                    'message' => $trendingResponse->body()
                ];

                return $this->handleError($errorData, $trendingResponse->status());
            }
            
            $configData = $configResponse->json()['images'];
            $trendingData = $trendingResponse->json();

            $data = [
                'data' => [],
                'total_pages' => $trendingData['total_pages']
            ];

            foreach ($trendingData['results'] as $movie) {
                $data['data'][] = $this->tmdbService->getMovieDetails($movie, $configData, ['date']);
            }

            return response()->json($data);
        } catch (\Exception $e) {
            $errorData = [
                'error' => 'Server Error: Unable to fetch trending movies from TMDB API',
                'status' => 500,
                'message' => $e->getMessage()
            ];

            return $this->handleError($errorData, 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $title = $request->input('title');
            $queryPage = $request->input('page', 1);
            $isNewSearch = $request->input('is_new_search', 0);

            if (empty($title) || !is_string($title)) {
                $errorData = [
                    'error' => 'Server Error: Title is required',
                    'status' => 400,
                    'message' => 'Title is required'
                ];

                return $this->handleError($errorData, 400);
            }

            if (empty($queryPage) || !is_numeric($queryPage) || $queryPage < 1) {
                $errorData = [
                    'error' => 'Server Error: Page must be a positive integer',
                    'status' => 400,
                    'message' => 'Page must be a positive integer'
                ];

                return $this->handleError($errorData, 400);
            }


            if($isNewSearch == 1) {
                $ipAddress = request()->ip();
                $searchCount = UserSearchLog::countSearchByIp($ipAddress);

                if($searchCount >= 5) {
                    $errorData = [
                        'error' => 'Server Error: You have reached the maximum number of searches per minute',
                        'status' => 429,
                        'message' => 'You have reached the maximum number of searches per minute'
                    ];

                    return $this->handleError($errorData, 429);
                }

                UserSearchLog::logSearch($ipAddress, $title);
            }

            $resultPerPage = 5;
            //   Indicates which page of TMDB API we are right now after showing 5 results only
            //   despite having a 20 results from TMDB API.
            $tmdbPage = (int) ceil($queryPage / 4);
            //   offset of the array after dividing the array into 4
            $offset = ($queryPage - 1) % 4;
            $cacheKey = "movies_search_" . md5($title) . "_api_page_{$tmdbPage}";
            $tmdbData = Cache::get($cacheKey);

            $configResponse = $this->tmdbService->get("configuration");
            if (!$configResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch configuration from TMDB API',
                    'status' => $configResponse->status(),
                    'message' => $configResponse->body()
                ];

                return $this->handleError($errorData, $configResponse->status());
            }
            $configData = $configResponse->json()['images'];

            if(!$tmdbData) {
                $searchResponse = $this->tmdbService->get('search/movie', [
                    'query' => $title,
                    'page' => $tmdbPage,
                ]);
                
                if (!$searchResponse->successful()) {
                    $errorData = [
                        'error' => 'Server Error: Unable to fetch movie search results from TMDB API',
                        'status' => $searchResponse->status(),
                        'message' => $searchResponse->body()
                    ];

                    return $this->handleError($errorData, $searchResponse->status());
                }
       
                $tmdbData = Arr::except($searchResponse->json(), ['page', 'total_results']);
                Cache::put($cacheKey, $tmdbData, now()->addMinutes(5));
            }
            
            $data = [
                'total_pages' => $tmdbData['total_pages'],
                'data' => []
            ];

            $tmdbArray = array_chunk($tmdbData['results'], $resultPerPage);
            //  if last page count is not 5 then it means it's the last page
            //  else calculate the total pages from TMDB API if the result is by 5
            $data['total_pages'] = (($tmdbData['total_pages'] - 1) * 4) + count($tmdbArray);
            
            foreach ($tmdbArray[$offset] ?? [] as $movie) {
                $data['data'][] = $this->tmdbService->getMovieDetails($movie, $configData, ['date']);
            }

            return response()->json($data);
        } catch (\Exception $e) {
            $errorData = [
                'error' => 'Server Error: Unable to fetch movie search results from TMDB API',
                'status' => 500,
                'message' => $e->getMessage()
            ];

            return $this->handleError($errorData, 500);
        }
    }

    public function details(Request $request, $id)
    {
        try {
            if(empty($id) || !is_numeric($id)) {
                $errorData = [
                    'error' => 'Server Error: Movie ID must be a number',
                    'status' => 400,
                    'message' => 'Movie ID must be a number'
                ];

                return $this->handleError($errorData, 400);
            }
            
            $configResponse = $this->tmdbService->get("configuration");
            $detailsResponse = $this->tmdbService->get("movie/{$id}");
            $trailerResponse = $this->tmdbService->get("movie/{$id}/videos");

            if(!$configResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch configuration from TMDB API',
                    'status' => $configResponse->status(),
                    'message' => $configResponse->body()
                ];

                return $this->handleError($errorData, $configResponse->status());
            }

            if(!$detailsResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch movie details from TMDB API',
                    'status' => $detailsResponse->status(),
                    'message' => $detailsResponse->body()
                ];

                return $this->handleError($errorData, $detailsResponse->status());
            }

            if(!$trailerResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch movie trailer from TMDB API',
                    'status' => $trailerResponse->status(),
                    'message' => $trailerResponse->body()
                ];

                return $this->handleError($errorData, $trailerResponse->status());
            }

            $data = $this->tmdbService->getMovieDetails($detailsResponse->json(), $configResponse->json()['images'], ['genres', 'overview', 'imdb_id']);
            
            $ratingResponse = $this->omdbService->get(['i' => $data['imdb_id']]);
            if(!$ratingResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch movie rating from OMDB API',
                    'status' => $ratingResponse->status(),
                    'message' => $ratingResponse->body()
                ];

                return $this->handleError($errorData, $ratingResponse->status());
            }
            $data['rating'] = $ratingResponse->json()['imdbRating'] ?? 'N/A';
            // use this when youtube api exceeded quota
            $data['trailer'] = (!empty($trailerResponse->json()['results']) ? $trailerResponse->json()['results'][0]['key'] : null);

            // this is working but not accurate
            // $title = (!empty($trailerResponse->json()['results']) ? $trailerResponse->json()['results'][0]['key'] : "{$data['title']} official movie trailer");
            // $youtubeTrailerResponse = $this->youtubeService->get('search', ['q' => $title, 'maxResults' => 1]);
            // if(!$youtubeTrailerResponse->successful()) {
            //     $errorData = [
            //         'error' => 'Server Error: Unable to fetch movie trailer from Youtube API',
            //         'status' => $youtubeTrailerResponse->status(),
            //         'message' => $youtubeTrailerResponse->body()
            //     ];

            //     return $this->handleError($errorData, $youtubeTrailerResponse->status());
            // }
            // $data['trailer'] = (!empty($youtubeTrailerResponse->json()['items']) ? $youtubeTrailerResponse->json()['items'][0]['id']['videoId'] : null);
            
            return response()->json($data);
        } catch (\Exception $e) {
            $errorData = [
                'error' => 'An error occurred while fetching movie details',
                'status' => 500,
                'message' => $e->getMessage()
            ];

            return $this->handleError($errorData, 500);
        }
    }

    public function recommendations(Request $request, $id)
    {
        try {
            $excludeMovieId = $request->input('exclude_movie_id');

            if(empty($id) || !is_numeric($id)) {
                $errorData = [
                    'error' => 'Server Error: Genre ID must be a number',
                    'status' => 400,
                    'message' => 'Genre ID must be a number'
                ];
            }

            if(!is_numeric($excludeMovieId)) {
                $errorData = [
                    'error' => 'Server Error: Exclude Movie ID must be a number',
                    'status' => 400,
                    'message' => 'Exclude Movie ID must be a number'
                ];

                return $this->handleError($errorData, 400);
            }

            $configResponse = $this->tmdbService->get("configuration");
            $recommendationsResponse = $this->tmdbService->get("discover/movie", ["with_genres" => $id]);

            if(!$configResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch configuration from TMDB API',
                    'status' => $configResponse->status(),
                    'message' => $configResponse->body()
                ];

                return $this->handleError($errorData, $configResponse->status());
            }

            if(!$recommendationsResponse->successful()) {
                $errorData = [
                    'error' => 'Server Error: Unable to fetch movie recommendations from TMDB API',
                    'status' => $recommendationsResponse->status(),
                    'message' => $recommendationsResponse->body()
                ];

                return $this->handleError($errorData, $recommendationsResponse->status());
            }

            $data = [
                'data' => [],
                'total_pages' => 1
            ];

            foreach ($recommendationsResponse->json()['results'] as $index => $movie) {
                if(count($data['data']) === 3) {
                    break;
                }

                if ($movie['id'] !== (int)$excludeMovieId) {
                    $data['data'][] = $this->tmdbService->getMovieDetails($movie, $configResponse->json()['images'], ['date']);
                }
            }

            return response()->json($data);
        } catch (\Exception $e) {
            log_error('An error occurred while fetching movie recommendations', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'An error occurred while fetching movie recommendations',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function handleError($errorData, $status) {
        logError(class_basename(__METHOD__), $errorData);
        return response()->json($errorData, $status);
    }
}
