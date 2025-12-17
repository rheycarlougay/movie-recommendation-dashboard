<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Services\TmdbService;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Integration Test: Test home endpoint returns trending movies with correct structure.
     */
    public function test_home_endpoint_returns_trending_movies(): void
    {
        // Mock TMDB API responses
        Http::fake([
            'api.themoviedb.org/3/configuration' => Http::response([
                'images' => [
                    'base_url' => 'https://image.tmdb.org/t/p/',
                    'profile_sizes' => ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
                ],
            ], 200),
            'api.themoviedb.org/3/trending/movie/day*' => Http::response([
                'results' => [
                    [
                        'id' => 1,
                        'title' => 'Test Movie 1',
                        'poster_path' => '/poster1.jpg',
                        'release_date' => '2024-01-01',
                    ],
                    [
                        'id' => 2,
                        'title' => 'Test Movie 2',
                        'poster_path' => '/poster2.jpg',
                        'release_date' => '2024-02-01',
                    ],
                ],
                'total_pages' => 10,
            ], 200),
        ]);

        $response = $this->getJson('/api/home?page=1');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'title',
                             'poster_path',
                             'release_date',
                         ],
                     ],
                     'total_pages',
                 ]);

        $responseData = $response->json();
        $this->assertCount(2, $responseData['data']);
        $this->assertEquals(10, $responseData['total_pages']);
        $this->assertEquals('Test Movie 1', $responseData['data'][0]['title']);
        $this->assertEquals('Test Movie 2', $responseData['data'][1]['title']);
    }

    /**
     * Integration Test: Test home endpoint validates page parameter.
     */
    public function test_home_endpoint_validates_page_parameter(): void
    {
        $response = $this->getJson('/api/home?page=0');

        $response->assertStatus(400)
                 ->assertJsonStructure([
                     'error',
                     'status',
                     'message',
                 ]);

        $responseData = $response->json();
        $this->assertEquals(400, $responseData['status']);
        $this->assertStringContainsString('Page must be a positive integer', $responseData['message']);
    }

    /**
     * Integration Test: Test home endpoint handles invalid page parameter.
     */
    public function test_home_endpoint_handles_invalid_page_parameter(): void
    {
        $response = $this->getJson('/api/home?page=-1');

        $response->assertStatus(400)
                 ->assertJsonStructure([
                     'error',
                     'status',
                     'message',
                 ]);
    }

    /**
     * Integration Test: Test home endpoint handles TMDB API errors gracefully.
     */
    public function test_home_endpoint_handles_tmdb_api_errors(): void
    {
        // Mock TMDB API error response
        Http::fake([
            'api.themoviedb.org/3/configuration' => Http::response([], 500),
        ]);

        $response = $this->getJson('/api/home?page=1');

        $response->assertStatus(500)
                 ->assertJsonStructure([
                     'error',
                     'status',
                     'message',
                 ]);

        $responseData = $response->json();
        $this->assertEquals(500, $responseData['status']);
        $this->assertStringContainsString('Unable to fetch configuration', $responseData['error']);
    }

    /**
     * Integration Test: Test home endpoint handles missing page parameter (defaults to 1).
     */
    public function test_home_endpoint_defaults_to_page_one(): void
    {
        Http::fake([
            'api.themoviedb.org/3/configuration' => Http::response([
                'images' => [
                    'base_url' => 'https://image.tmdb.org/t/p/',
                    'profile_sizes' => ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
                ],
            ], 200),
            'api.themoviedb.org/3/trending/movie/day*' => Http::response([
                'results' => [],
                'total_pages' => 1,
            ], 200),
        ]);

        $response = $this->getJson('/api/home');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data',
                     'total_pages',
                 ]);
        
        // Verify that the trending request was made
        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'trending/movie/day');
        });
    }

    /**
     * Integration Test: Test home endpoint formats poster paths correctly.
     */
    public function test_home_endpoint_formats_poster_paths_correctly(): void
    {
        Http::fake([
            'api.themoviedb.org/3/configuration' => Http::response([
                'images' => [
                    'base_url' => 'https://image.tmdb.org/t/p/',
                    'profile_sizes' => ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
                ],
            ], 200),
            'api.themoviedb.org/3/trending/movie/day*' => Http::response([
                'results' => [
                    [
                        'id' => 1,
                        'title' => 'Test Movie',
                        'poster_path' => '/test-poster.jpg',
                        'release_date' => '2024-01-01',
                    ],
                ],
                'total_pages' => 1,
            ], 200),
        ]);

        $response = $this->getJson('/api/home?page=1');

        $response->assertStatus(200);
        
        $responseData = $response->json();
        $posterPath = $responseData['data'][0]['poster_path'];
        
        // Verify poster path contains base URL and uses original size
        $this->assertStringContainsString('https://image.tmdb.org/t/p/', $posterPath);
        $this->assertStringContainsString('/test-poster.jpg', $posterPath);
    }
}

