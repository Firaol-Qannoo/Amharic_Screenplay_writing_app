<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\Test;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ScriptsController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\ProductionScheduleController;
use App\Http\Controllers\SceneController;
use App\Http\Controllers\ScriptInvitationController;
use App\Http\Controllers\StoryboardController;


  // Route::get('/', function () {
    //     return view('welcome');
    // });

   

   
        Route::post('/invitations', [ScriptInvitationController::class, 'store']); // Invite user
        Route::get('/invitation/accept/{token}', [ScriptInvitationController::class, 'accept'])->name('invitation.accept');

        Route::post('/scenes', [SceneController::class, 'store']);
        Route::get('/scenes/{id}', [SceneController::class, 'show']);

        Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('google.login');
        Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
  

    Route::get('/', function () {
        // return Inertia::render('Home', ['name' => '']);
        return Inertia::render('Landing');
    });

    Route::get('/signup', function () {
        return Inertia::render('auth/SignUpPage');
    })->name('signup');

    Route::get('/register', function () {
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

    Route::post('/register', [RegisterController::class, 'store'])->name('register');

        // Handle Login Form Submission
    Route::post('/login', [RegisterController::class, 'login'])->name('login');

   

    // Route::get('/editor', function () {
    //     return Inertia::render('writers/EditorPage');
    // })->name('editor');

    Route::get('/editor', [EditorController::class, 'index'])->name('editor');
    Route::get('/editor/{id}', [EditorController::class, 'edit'])->name('editor.edit');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::delete('/delete/{id}', [ScriptsController::class, 'destroy'])->name('delete.destroy');


    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Storyboard routes
        Route::get('/drawer/storyboard/{scriptID?}', [StoryboardController::class, 'index'])->name('storyboard.index');
        Route::post('/storyboard', [StoryboardController::class, 'store'])->name('storyboard.store');
        Route::put('/storyboard/{id}', [StoryboardController::class, 'update'])->name('storyboard.update');
        Route::delete('/storyboard/{id}', [StoryboardController::class, 'destroy'])->name('storyboard.destroy');
        Route::post('/storyboard/generate-image', [StoryboardController::class, 'generateImage'])->name('storyboard.generate-image');
        Route::get('/storyboard/stream/{scriptId}', [StoryboardController::class, 'streamUpdates'])
            ->name('storyboard.stream');
    });

    Route::post('/forgot-password', [RegisterController::class, 'sendResetOtp']);
    Route::post('/reset-password', [RegisterController::class, 'resetPassword']);
    Route::post('/verify-otp', [RegisterController::class, 'verifyOtp']);

    Route::post('/scripts', [ScriptsController::class, 'store'])->name('scripts');
// routes/web.php
Route::post('/production-schedule', [ProductionScheduleController::class, 'showWithStaticData']);



     Route::post('/verify-signup-otp', [RegisterController::class, 'verifySignupOtp'])->name('verify-signup-otp');
     Route::get('/verify-otp-signup', function () {
        return Inertia::render('verify_otp_signup'); // Make sure this is the correct Inertia component
    })->name('verify-otp-signup');
    

    Route::get('/scripts', [ScriptsController::class, 'index'])->name('scripts.index');
    Route::post('/scripts/{scriptID}/scenes', [SceneController::class, 'store'])->name('scenes.store');
    Route::post('/settings/update', [RegisterController::class, 'update'])->name('settings.update');