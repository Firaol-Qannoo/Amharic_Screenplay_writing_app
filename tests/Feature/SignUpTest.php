<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Mail\SignupOtpMail;
use Illuminate\Support\Facades\Route;

class SignUpTest extends TestCase
{

    public function test_signup_with_valid_input()
    {
        // Mock the OTP email sending process
        Mail::fake();
        Cache::shouldReceive('put')->once(); // Mock Cache::put

        $requestData = [
            'fullname' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        // Send a POST request to the route
        $response = $this->post(route('signup.store'), $requestData);

        // Check that the OTP email was sent
        Mail::assertSent(SignupOtpMail::class);

        // Check that the cache was set (you can add more cache checks here)
        Cache::assertHas('otp_test@example.com');

        // Check if we are being redirected to OTP verification page
        $response->assertInertia(function ($page) {
            return $page->component('verify_otp_signup') && $page->has('email', 'test@example.com');
        });
    }

    public function test_signup_with_existing_email()
    {
        // Create a user with the same email
        User::factory()->create(['email' => 'test@example.com']);

        $requestData = [
            'fullname' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->post(route('register'), $requestData);

        $response->assertSessionHasErrors('email');
        $response->assertRedirect(route('signup'));  
    }

    public function test_signup_otp_failure()
    {
        Mail::fake();
        Cache::shouldReceive('put')->once(); // Mock Cache::put

        Mail::shouldReceive('send')->andThrow(new \Exception('Mail failed to send'));

        $requestData = [
            'fullname' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->post(route('register'), $requestData);

        $response->assertSessionHasErrors();
        $response->assertRedirect(route('signup'));  
    }
}
