<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetOtpMail;
use Illuminate\Support\Facades\Cache;

class RegisterController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'fullname' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        // Create user
        $user = User::create([
            'first_name' => $validated['fullname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->save();

        // Redirect to dashboard or login
        return redirect()->route('login');
    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            if (Auth::check()) {
                return redirect()->route('dashboard');
            } else {
                return back()->withErrors(['email' => 'Authentication failed.']);
            }

        }

        return back()->withErrors(['email' => 'Invalid credentials.']);
    }

    public function logout()
    {
        Auth::logout();
        // return Inertia::render('auth/LoginPage', [
        //     'success' => 'Logged out successfully.',
        // ]);
        return redirect()->route('login');
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
    
        // return Inertia::render('login', [
        //     'success' => 'Password updated successfully!!'
        // ]);
        return redirect()->route('login');
    }
}
