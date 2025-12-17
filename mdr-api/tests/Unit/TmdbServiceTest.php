<?php

namespace Tests\Unit;

use App\Services\TmdbService;
use Tests\TestCase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class TmdbServiceTest extends TestCase
{
    private TmdbService $tmdbService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Set a test API key using environment variable
        // This is set before creating the service instance
        putenv('TMDB_API_KEY=test-api-key');
        
        $this->tmdbService = new TmdbService();
    }
    
    protected function tearDown(): void
    {
        putenv('TMDB_API_KEY=');
        parent::tearDown();
    }

    /**
     * Unit Test: Test hasApiKey returns true when API key is set.
     */
    public function test_has_api_key_returns_true_when_key_is_set(): void
    {
        $result = $this->tmdbService->hasApiKey();
        
        $this->assertTrue($result);
    }

    /**
     * Unit Test: Test hasApiKey returns false when API key is not set.
     */
    public function test_has_api_key_returns_false_when_key_is_not_set(): void
    {
        // Use reflection to create a service with an empty API key
        // This tests the hasApiKey() logic directly without relying on env() caching
        $reflection = new \ReflectionClass(TmdbService::class);
        $service = $reflection->newInstanceWithoutConstructor();
        
        // Set the private apiKey property to null/empty
        $property = $reflection->getProperty('apiKey');
        $property->setAccessible(true);
        $property->setValue($service, null);
        
        $result = $service->hasApiKey();
        
        $this->assertFalse($result);
    }

    /**
     * Unit Test: Test getMovieDetails formats movie data correctly.
     */
    public function test_get_movie_details_formats_data_correctly(): void
    {
        $movie = [
            'id' => 123,
            'title' => 'Test Movie',
            'poster_path' => '/test-poster.jpg',
            'release_date' => '2024-01-01',
        ];

        $config = [
            'base_url' => 'https://image.tmdb.org/t/p/',
            'profile_sizes' => ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
        ];

        $result = $this->tmdbService->getMovieDetails($movie, $config, ['date']);

        $this->assertEquals(123, $result['id']);
        $this->assertEquals('Test Movie', $result['title']);
        $this->assertEquals('2024-01-01', $result['release_date']);
        $this->assertStringContainsString('https://image.tmdb.org/t/p/', $result['poster_path']);
        $this->assertStringContainsString('/test-poster.jpg', $result['poster_path']);
    }

    /**
     * Unit Test: Test getMovieDetails handles TV shows with name instead of title.
     */
    public function test_get_movie_details_handles_tv_shows_with_name(): void
    {
        $tvShow = [
            'id' => 456,
            'name' => 'Test TV Show',
            'poster_path' => '/test-poster.jpg',
            'first_air_date' => '2024-02-01',
        ];

        $config = [
            'base_url' => 'https://image.tmdb.org/t/p/',
            'profile_sizes' => ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
        ];

        $result = $this->tmdbService->getMovieDetails($tvShow, $config, ['date']);

        $this->assertEquals(456, $result['id']);
        $this->assertEquals('Test TV Show', $result['title']);
        $this->assertEquals('2024-02-01', $result['release_date']);
    }

    /**
     * Unit Test: Test getMovieDetails handles missing poster_path gracefully.
     */
    public function test_get_movie_details_handles_missing_poster_path(): void
    {
        $movie = [
            'id' => 789,
            'title' => 'Movie Without Poster',
        ];

        $config = [
            'base_url' => 'https://image.tmdb.org/t/p/',
            'profile_sizes' => ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
        ];

        $result = $this->tmdbService->getMovieDetails($movie, $config, []);

        $this->assertEquals(789, $result['id']);
        $this->assertEquals('Movie Without Poster', $result['title']);
        $this->assertStringContainsString('/null', $result['poster_path']);
    }

    /**
     * Unit Test: Test getMovieDetails handles additional data fields.
     */
    public function test_get_movie_details_handles_additional_data_fields(): void
    {
        $movie = [
            'id' => 999,
            'title' => 'Movie With Extra Data',
            'poster_path' => '/poster.jpg',
            'overview' => 'Movie description',
            'vote_average' => 8.5,
        ];

        $config = [
            'base_url' => 'https://image.tmdb.org/t/p/',
            'profile_sizes' => ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
        ];

        $result = $this->tmdbService->getMovieDetails($movie, $config, ['overview', 'vote_average']);

        $this->assertEquals('Movie description', $result['overview']);
        $this->assertEquals(8.5, $result['vote_average']);
    }
}

