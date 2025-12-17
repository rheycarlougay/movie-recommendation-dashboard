<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TmdbService
{
    private $apiKey;
    private $baseUrl = 'https://api.themoviedb.org/3';

    public function __construct()
    {
        $this->apiKey = env('TMDB_API_KEY');
    }

    public function hasApiKey()
    {
        return !empty($this->apiKey);
    }

    public function get(string $url, array $queryParams = [])
    {
        try {
            if(!$this->hasApiKey()) {
                throw new Exception('TMDB API key is not configured');
            }

            $url = "{$this->baseUrl}/{$url}";

            return Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($url, $queryParams);
        } catch (\Exception $e) {
            throw $e;
        }
        
    }

    public function getMovieDetails(array $movie, array $config, array $additionalData = [], string $imageSize = 'profile_sizes')
    {
        try {
            $data = [
                'id' => $movie['id'],
                'title' => $movie['title'] ?? $movie['name'],
                // always get the original size
                'poster_path' => $config['base_url'] . $config['profile_sizes'][count($config['profile_sizes']) - 1] . ($movie['poster_path'] ?? "/null"),
            ];
    
            foreach($additionalData as $key => $value) {
                if($value === 'date') {
                    $data['release_date'] = $movie['release_date'] ?? $movie['first_air_date'];
                } else {
                    $data[$value] = $movie[$value];
                }
            }
    
            return $data;
        } catch (\Exception $e) {
            throw $e;
        }
        
    }
}
