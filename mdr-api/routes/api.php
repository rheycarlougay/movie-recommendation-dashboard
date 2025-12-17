<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\FavoriteController;

Route::get('/home', [HomeController::class, 'index']);
Route::get('/search', [HomeController::class, 'search']);
Route::get('/movie/{id}', [HomeController::class, 'details']);
Route::get('/recommendations/{id}', [HomeController::class, 'recommendations']);