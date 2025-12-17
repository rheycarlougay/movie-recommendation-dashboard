<?php

use Illuminate\Support\Facades\Log;

if (!function_exists('logError')) {
    function logError($message, array $context = [])
    {
        Log::error($message, $context);
    }
}
