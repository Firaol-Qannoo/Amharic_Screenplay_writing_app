<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\SignupOtpMail;
use App\Models\User;

class RegisterControllerTest extends TestCase
{

    protected function setUp(): void
    {
        parent::setUp();
        User::truncate(); // Clean users collection before each test
        Mail::fake();     // Prevent actual email sending during test
        Cache::flush();   // Clean cache
    }

    public function test_user_can_register()
    {
        $data = [
            'fullname' => 'Abebe Lema',
            'email' => 'abebe@example.com',
            'password' => 'password123',
        ];

        // Step 1: Submit registration
        $response = $this->post(route('register'), $data);
        $response->assertStatus(200);
        $response->assertSee('verify_otp_signup'); // Ensure OTP page is rendered

        // Step 2: Check cached OTP data
        $cached = Cache::get('otp_' . $data['email']);
        $this->assertNotNull($cached);
        $this->assertEquals($data['email'], $cached['email']);

        // Step 3: Submit OTP verification
        $verifyResponse = $this->post(route('verify-signup-otp'), [
            'email' => $data['email'],
            'otp' => $cached['otp'],
        ]);

        // Step 4: Assert user is created and redirected to login
        $this->assertDatabaseHas('users', ['email' => $data['email']]);
        $verifyResponse->assertRedirect(route('login'));
    }

    public function test_user_cannot_register_with_invalid_data()
    {
        $response = $this->post(route('register'), [
           'fullname' => 'Abebe Lema',
            'email' => 'abebe@example.com',
            // missing password
        ]);

        $response->assertSessionHasErrors('password');
    }

    public function test_user_can_login()
    {
        $user = User::create([
            'first_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->post(route('login'), [
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials()
    {
        $response = $this->post(route('login'), [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        $this->assertGuest();
        $response->assertRedirect(route('login'));
    }

    public function test_user_can_logout()
    {
        $user = User::create([
            'first_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $this->actingAs($user);
        $response = $this->post(route('logout'));
        $response->assertRedirect(route('home'));
        $this->assertGuest();
    }
}
