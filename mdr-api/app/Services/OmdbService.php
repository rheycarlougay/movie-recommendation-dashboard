<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OmdbService
{
    private $apiKey;
    private $baseUrl = 'http://www.omdbapi.com';

    public function __construct()
    {
        $this->apiKey = env('OMDB_API_KEY');
    }

    public function hasApiKey()
    {
        return !empty($this->apiKey);
    }

    public function get(array $queryParams = []) {
        try {
            if(!$this->hasApiKey()) {
                throw new Exception('OMDB API key is not configured');
            }

            $url = "{$this->baseUrl}/?apikey={$this->apiKey}&" . http_build_query($queryParams);

            return Http::withHeaders([
                'Accept' => 'application/json',
            ])->get($url);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
