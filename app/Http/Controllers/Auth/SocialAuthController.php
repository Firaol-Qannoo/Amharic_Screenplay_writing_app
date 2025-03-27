<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SocialAuthController extends Controller {
    /**
     * Redirect to Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google callback and login the user.
     */
    public function handleGoogleCallback()
{
    try {
        Log::info('Google OAuth callback triggered.');

        $googleUser = Socialite::driver('google')->stateless()
            ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
            ->user();

        Log::info('Google user retrieved.', [
            'id' => $googleUser->getId(),
            'email' => $googleUser->getEmail(),
            'name' => $googleUser->getName(),
        ]);

        $nameParts = explode(' ', $googleUser->getName(), 2);

        $firstName = $nameParts[0]; 
        $lastName = isset($nameParts[1]) ? $nameParts[1] : '';

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'password' => bcrypt(Str::random(24)),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),

            ]
        );

        Log::info('User found or created.', ['user_id' => $user->id]);

        Auth::login($user);

        Log::info('User logged in successfully.', ['user_id' => $user->id]);

        // return redirect()->route('dashboard')->with('success', 'Logged in with Google!');
        return Inertia::render('dashboard', [
            'success' => 'Logged in with Google!',
        ]);
    } catch (\Exception $e) {
        Log::error('Google OAuth error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
        
        return redirect()->route('login')->with('error', 'Something went wrong. Check logs for details.');
    }
 }
 }