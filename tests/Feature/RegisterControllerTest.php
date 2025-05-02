<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class RegisterControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        User::truncate(); // Clean users collection before each test
    }

    public function test_user_can_register()
    {
        $data = [
            'fullname' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        $response = $this->post(route('register'), $data);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
        $response->assertRedirect(route('login'));
    }

    public function test_user_cannot_register_with_invalid_data()
    {
        $data = [
            'fullname' => 'John Doe',
            'email' => 'john@example.com',
        ];

        $response = $this->post(route('register'), $data);
        $response->assertSessionHasErrors('password');
    }

    public function test_user_can_login()
    {
        $user = User::create([
            'first_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $data = [
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        $response = $this->post(route('login'), $data);
        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials()
    {
        $data = [
            'email' => 'john@example.com',
            'password' => 'wrongpassword',
        ];

        $response = $this->post(route('login'), $data);
        $response->assertSessionHasErrors('email');
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
        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }
}