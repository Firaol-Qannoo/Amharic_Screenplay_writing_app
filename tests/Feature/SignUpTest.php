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
        Mail::fake();
        Cache::shouldReceive('put')->once(); 

        $requestData = [
            'fullname' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->post(route('signup.store'), $requestData);

        Mail::assertSent(SignupOtpMail::class);
        Cache::assertHas('otp_test@example.com');

        $response->assertInertia(function ($page) {
            return $page->component('verify_otp_signup') && $page->has('email', 'test@example.com');
        });
    }

    public function test_signup_with_existing_email()
    {
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
        Cache::shouldReceive('put')->once(); 

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
