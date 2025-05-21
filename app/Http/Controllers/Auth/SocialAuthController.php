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
    public function handleGoogleCallback()  {
    

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

        // Check if user already exists by email
        $user = User::where('email', $googleUser->getEmail())->first();


    if (!$user) {
        // $nameParts = explode(' ', $googleUser->getName(), 2);

        // $firstName = $nameParts[0]; 
        // $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
         $fullname = $googleUser->getName();

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'first_name' => $fullname,
                'password' => bcrypt(Str::random(24)), // Random password since Google handles auth
                'avatar' => $googleUser->getAvatar(), // Or store locally if you want
                'userColor' => $this->generateRandomCode(), // Your custom logic
                'google_id' => $googleUser->getId(),

            ]
        );

        Log::info('New Google user created.', ['user_id' => $user->id]);
        } else {
            // Existing user, optionally link Google ID if not yet linked
            if (!$user->google_id) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                ]);
            }

            Log::info('Existing user logged in with Google.', ['user_id' => $user->id]);
        }

        Auth::login($user);

        Log::info('User logged in successfully.', ['user_id' => $user->id]);

        flash()->success(
            'Logged in with Google!!'
        );
        return Inertia::location(route('dashboard'));
        
    } catch (\Exception $e) {
        Log::error('Google OAuth error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
        
        // return redirect()->route('login')->with('error', 'Something went wrong. Check logs for details.');
        flash()->error(
            'Something went wrong. Please retry later.'
        );
        return Inertia::location(route('login'));
    }
 }


        public function generateRandomCode() {
            // Characters: 1-9 and A-F
            $characters = array_merge(range('1', '9'), range('A', 'F'));

            $code = '';
            for ($i = 0; $i < 6; $i++) {
                $code .= $characters[array_rand($characters)];
            }

            return $code;
    }
 }