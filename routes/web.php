<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ScriptsController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\ProductionScheduleController;
use App\Http\Controllers\SceneController;
use App\Http\Controllers\ScriptInvitationController;
use App\Http\Controllers\ImportScriptController;
use App\Http\Controllers\StoryboardController;
use App\Http\Controllers\ContactController;




Route::get('/invitation/accept/{token}', [ScriptInvitationController::class, 'accept'])->name('invitation.accept');
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);


Route::get('/', [DashboardController::class, 'home'])->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
});

Route::get('/contact', function () {
    return Inertia::render('contact');
});

Route::get('/services', function () {
    return Inertia::render('services');
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


Route::get('/editor', [EditorController::class, 'index'])->name('editor');
Route::get('/editor/{id}', [EditorController::class, 'edit'])->name('editor.edit');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/dashboard', [DashboardController::class, 'admindashboard'])->name('admindashboard');
Route::delete('/delete-script/{id}', [ScriptsController::class, 'destroy'])->name('delete-script.destroy');


Route::middleware(['auth'])->group(function () {
    Route::get('/editor', [EditorController::class, 'index'])->name('editor');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/import-script', [ImportScriptController::class, 'store'])->name('import-script');
    Route::post('/logout', [RegisterController::class, 'logout'])->name('logout');
    Route::post('/scripts', [ScriptsController::class, 'store'])->name('scripts');

    Route::get('/production-schedule', [ProductionScheduleController::class, 'index'])->name('scenes.index');
    Route::post('/production-schedule', [ProductionScheduleController::class, 'showWithStaticData'])->name('scenes.update');
    Route::post('/production-schedule/save-locations', [ProductionScheduleController::class, 'saveShootLocations']);
    Route::get('/scripts/{scriptId}/storyboard', [StoryboardController::class, 'index'])->name('storyboard.index');
    Route::post('/storyboard/save', [StoryboardController::class, 'save']);
    Route::post('/scripts/{scriptID}/scenes', [SceneController::class, 'store'])->name('scenes.store');
    Route::post('/settings/update', [RegisterController::class, 'update'])->name('settings.update');
    Route::put('/scripts/{id}', [ScriptsController::class, 'update'])->name('scripts.update');

    Route::delete('/delete-collab/{scriptID}/{userID}', [ScriptInvitationController::class, 'deleteCollaborator'])->name('delete-script.deleteCollaborator');
    Route::put('/update-collaborator-role/{scriptId}/{userId}', [ScriptInvitationController::class, 'updateCollaboratorRole']);

    Route::post('/invitations', [ScriptInvitationController::class, 'store'])->name('invitations.store'); // Invite user
    Route::post('/scenes', [SceneController::class, 'store'])->name('scenes.store');    
    Route::get('/scenes/{id}', [SceneController::class, 'show']);
});

Route::post('/forgot-password', [RegisterController::class, 'sendResetOtp']);
Route::post('/reset-password', [RegisterController::class, 'resetPassword']);
Route::post('/verify-otp', [RegisterController::class, 'verifyOtp']);

Route::post('/verify-signup-otp', [RegisterController::class, 'verifySignupOtp'])->name('verify-signup-otp');

Route::get('/verify-otp-signup', function () {
    return Inertia::render('verify_otp_signup'); 
})->name('verify-otp-signup');

Route::post('/contact-msg', [ContactController::class, 'send'])->name('contact-msg.send');
