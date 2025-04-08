<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\ScriptsController;
use App\Http\Controllers\EditorController;

  // Route::get('/', function () {
    //     return view('welcome');
    // });

    Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('google.login');
    Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
  

    Route::get('/', function () {
        // return Inertia::render('Home', ['name' => '']);
        return Inertia::render('Landing');
    });

    Route::get('/signup', function () {
        return Inertia::render('auth/SignUpPage');
    });

    Route::get('/forgot-password', function () {
        return Inertia::render('ForgotPassword');
    });

    Route::get('/verify-otp', function () {
        return Inertia::render('VerifyOtp');
    });

    Route::get('/reset-password', function () {
        return Inertia::render('ResetPassword');
    });

    Route::get('/login', function () {
        return Inertia::render('auth/LoginPage');
    })->name('login');

    Route::post('/register', [RegisterController::class, 'store']);

        // Handle Login Form Submission
    Route::post('/login', [RegisterController::class, 'login']);

   

    // Route::get('/editor', function () {
    //     return Inertia::render('writers/EditorPage');
    // })->name('editor');

    Route::get('/editor', [EditorController::class, 'index'])->name('editor');

    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('writers/Dashboard/DashboardPage', [
                'user' => Auth::user(),
                'success' => 'Login successfully.',
            ]);
        })->name('dashboard');
        
        Route::post('/logout', [RegisterController::class, 'logout'])->name('logout');
    });

    Route::post('/forgot-password', [RegisterController::class, 'sendResetOtp']);
    Route::post('/reset-password', [RegisterController::class, 'resetPassword']);
    Route::post('/verify-otp', [RegisterController::class, 'verifyOtp']);

    Route::post('/scripts', [ScriptsController::class, 'store'])->name('scripts');
    