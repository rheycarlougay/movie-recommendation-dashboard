<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class YoutubeService
{
    private $apiKey;
    private $baseUrl = 'https://www.googleapis.com/youtube/v3';

    public function __construct()
    {
        $this->apiKey = env('YOUTUBE_API_KEY');
    }

    public function hasApiKey()
    {
        return !empty($this->apiKey);
    }

    public function get(string $url, array $queryParams = [])
    {
        try {
            if(!$this->hasApiKey()) {
                throw new Exception('Youtube API key is not configured');
            }

            $url = "{$this->baseUrl}/{$url}?key={$this->apiKey}";

            foreach($queryParams as $key => $value) {
                $url .= '&' . $key . '=' . $value;
            }

            return Http::withHeaders([
                'Accept' => 'application/json',
            ])->get($url);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
