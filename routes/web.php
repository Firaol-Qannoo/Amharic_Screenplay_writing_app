<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;

  // Route::get('/', function () {
    //     return view('welcome');
    // });

    Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('google.login');
    Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
  

    Route::get('/', function () {
        // return Inertia::render('Home', ['name' => '']);
        return Inertia::render('Home');
    });

    Route::get('/signup', function () {
        return Inertia::render('signup');
    });

    Route::get('/login', function () {
        return Inertia::render('login');
    })->name('login');

    Route::post('/register', [RegisterController::class, 'store']);

        // Handle Login Form Submission
    Route::post('/login', [RegisterController::class, 'login']);

    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('dashboard', [
                'user' => Auth::user(),
                'success' => 'Login successfully.',
            ]);
        })->name('dashboard');
        
        Route::post('/logout', [RegisterController::class, 'logout'])->name('logout');
    });
    