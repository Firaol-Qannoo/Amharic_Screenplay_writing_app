<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\SignupOtpMail;
use App\Mail\ResetOtpMail;
use Illuminate\Support\Facades\Cache;
use App\Models\Script;
use App\Models\ScriptInvitation;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{

   public function register() {
     // // Validate incoming data
        // $validated = $request->validate([
        //     'fullname' => 'required|string',
        //     'email' => 'required|email|unique:users,email',
        //     'password' => 'required|min:6',
        // ]);

        // // Create user
        // $user = User::create([
        //     'first_name' => $validated['fullname'],
        //     'email' => $validated['email'],
        //     'password' => Hash::make($validated['password']),
        // ]);

        // $user->save();

        // // Redirect to dashboard or login
        // return redirect()->route('login');

         // Validate signup data
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

   public function store(Request $request) {
    // Validate the input
    $validated = $request->validate([
        'fullname' => ['required', 'string', 'regex:/^[a-zA-Z\s]+$/'],
        'email' => 'required|email',
        'password' => 'required|string|min:6',
        'profilePicture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ], [
        'fullname.regex' => 'The full name must contain only letters and spaces.',
    ]);

    // Check if the email already exists
    $existingUser = User::where('email', $validated['email'])->first();
    
    if ($existingUser) {
        flash()->error(
            'An account with this email already exists. Please use a different email or log in.'
        );

        return Inertia::location(route('signup'));
    }

    try {
        $otp = rand(100000, 999999);

         // Handle profile picture upload
         $profilePicturePath = null;

         if ($request->hasFile('profilePicture')) {
             $file = $request->file('profilePicture');
         
             // Generate unique name
             $profilePictureName = time() . '_' . $file->getClientOriginalName();
         
             // Ensure the folder exists
             $destinationPath = public_path('profile_pictures');
             if (!file_exists($destinationPath)) {
                 mkdir($destinationPath, 0755, true); // Create folder if it doesn't exist
             }
         
             // Move file to public/profile_pictures
             $file->move($destinationPath, $profilePictureName);
         
             // Store relative path to DB or use as needed
             $profilePicturePath = 'profile_pictures/' . $profilePictureName;
         }

         
        // Cache the OTP and user data for verification later
        $cacheKey = 'otp_' . $validated['email'];
        Cache::put($cacheKey, [
            'fullname' => $validated['fullname'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'otp' => $otp,
            'avatar' => $profilePicturePath, // Save path to cache
            'userColor' => $this->generateRandomCode(),
        ], now()->addMinutes(10));

        Mail::to($validated['email'])->send(new SignupOtpMail($otp));

        return Inertia::render('verify_otp_signup', [
            'email' => $validated['email']
        ]);
    } catch (\Exception $e) {
        flash()->error(
            'We couldn’t send the OTP right now. Please check your internet connection or try again shortly.'
        );
        return Inertia::location(route('signup'));
    }
}




public function verifySignupOtp(Request $request) {
    // Validate the incoming request
    $request->validate([
        'email' => 'required|email',  // Ensure email is valid
        'otp' => 'required|numeric',  // Ensure OTP is numeric
    ]);

    // Retrieve the OTP data stored in cache for this email
    $data = Cache::get('otp_' . $request->email);

    // If no data is found in cache, it means OTP is expired or invalid
    if (!$data) {
        return Inertia::render('verify_otp_signup', [
            'email' => $request->email,
            'errors' => ['otp' => 'OTP expired or invalid.']
        ]);
    }

    // If the OTP entered doesn't match the stored OTP
    if ($data['otp'] != $request->otp) {
        return Inertia::render('verify_otp_signup', [
            'email' => $request->email,
            'errors' => ['otp' => 'Incorrect OTP entered. Please try again.']
        ]);
    }

    // Create the user after successful OTP verification
    $user = User::create([
        'first_name' => $data['fullname'],
        'email' => $data['email'],
        'password' => $data['password'],  // Password should be hashed (bcrypt) in model
        'avatar' => $data['avatar'],
        'userColor' => $data['userColor'],
    ]);

    // Get the user's unique ID
    $userId = $user->_id;

    // Check if this user was invited to any script
    $invitation = ScriptInvitation::where('invitee_email', $data['email'])->first();

    // If an invitation exists, update the invitation but do not add to collaborators
    if ($invitation) {
        // Retrieve the associated script for the invitation
        $script = Script::findOrFail($invitation->script_id);

        $script->collaborators()->syncWithoutDetaching([$userId]);

        // Mark the invitation as accepted and assign the invitee_id (user ID)
        $invitation->accepted = true;
        $invitation->invitee_id = $userId;
        $invitation->save();

        // Log that the user has been added to the script
        Log::info("User accepted invitation for script", [
            'user_id' => $userId,
            'script_id' => $script->_id
        ]);
    }

    // Save the new user record
    $user->save();

    // Remove the OTP from the cache now that the user has been verified
    Cache::forget('otp_' . $request->email);

    // Flash success message and redirect to the login page
    flash()->success('Account verified. You may now log in.');
    return Inertia::location(route('login'));
}


    




   public function login(Request $request) {
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
        $user = Auth::user();

        if ($token = session('invitation_token')) {
            session()->forget('invitation_token');
            return redirect()->route('invitation.accept', ['token' => $token]);
        }

        $invitation = ScriptInvitation::where('invitee_email', $user->email)
            ->where('accepted', false)
            ->first();
        $userId = $user->_id;

        if ($invitation) {
            $script = Script::find($invitation->script_id);
            if ($script) {
                $script->collaborators()->syncWithoutDetaching([$userId]);

                $invitation->accepted = true;
                $invitation->invitee_id = $userId;
                $invitation->save();

                Log::info("User added to collaborators on login", [
                    'user_id' => (string) $userId,
                    'script_id' => $script->_id
                ]);
            }
        }

        flash()->success('Logged in successfully!');
        return Inertia::location(route('dashboard'));
    } else {
        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            flash()->error('No account found with this email.');
            return Inertia::location(route('login'));
        }

        flash()->error('Invalid credentials. Please check your email and password.');
        return Inertia::location(route('login'));
    }
}

    
    
      public function logout() {
        Auth::logout();
        flash()->success(
            'Logged out successfully!'
        );
        return Inertia::location(route('login'));
       }


    public function sendResetOtp(Request $request) {
        $request->validate(['email' => 'required|email|exists:users,email']);
        
        $otp = rand(100000, 999999);
        Cache::put("otp_{$request->email}", $otp, now()->addMinutes(10));
    
        Mail::to($request->email)->send(new ResetOtpMail($otp));
    
        return Inertia::render('ForgotPassword', [
            'success' => 'OTP has been sent to your email.'
        ]);
    }

    public function verifyOtp(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required',
        ]);
    
        $cachedOtp = Cache::get("otp_{$request->email}");
        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return back()->withErrors(['error' => 'Invalid OTP'], 400);
        }

        return Inertia::render('ResetPassword', [
            'success' => 'OTP verified.'
        ]);
    }
    
    public function resetPassword(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|confirmed',
        ]);
    
        User::where('email', $request->email)->update(['password' => Hash::make($request->password)]);
        Cache::forget("otp_{$request->email}");
    
        flash()->success(
            'Password updated successfully!!'
        );
        return Inertia::location(route('login'));
    }

    public function update(Request $request) {
    $request->validate([
        'first_name' => 'required|string|max:255',
        // 'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
    ]);

    auth()->user()->update($request->only('first_name'));

    flash()->success('Account Updated successfully!');
       return Inertia::location(route('dashboard'));
 }


 


}
