<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;
use App\Mail\ResetOtpMail;
use Illuminate\Support\Facades\Hash;

class ResetPasswordOtpTest extends TestCase
{
    public function it_sends_an_otp_to_registered_email() {
        Mail::fake();
        $user = User::factory()->create();

        $response = $this->post(route('forgot-password'), ['email' => $user->email]);

        $response->assertInertia(fn ($page) =>
            $page->component('ForgotPassword')
                 ->has('success')
        );

        Mail::assertSent(ResetOtpMail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });

        $this->assertTrue(Cache::has("otp_{$user->email}"));
    }

    /** @test */
    public function it_rejects_invalid_email_when_sending_otp()
    {
        $response = $this->post(route('password.otp.send'), ['email' => 'nonexistent@example.com']);
        $response->assertSessionHasErrors('email');
    }

  
    public function it_verifies_correct_otp()
    {
        $user = User::factory()->create();
        Cache::put("otp_{$user->email}", '123456', now()->addMinutes(10));

        $response = $this->post(route('verify-otp'), [
            'email' => $user->email,
            'otp' => '123456',
        ]);

        $response->assertInertia(fn ($page) =>
            $page->component('ResetPassword')
                 ->has('success')
        );
    }

   
    public function it_rejects_incorrect_otp()
    {
        $user = User::factory()->create();
        Cache::put("otp_{$user->email}", '123456', now()->addMinutes(10));

        $response = $this->from(route('password.otp.verify'))
                         ->post(route('password.otp.verify'), [
                             'email' => $user->email,
                             'otp' => '000000',
                         ]);

        $response->assertRedirect(route('password.otp.verify'));
        $response->assertSessionHasErrors(['error']);
    }

    /** @test */
    public function it_resets_password_successfully()
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);
        Cache::put("otp_{$user->email}", '123456', now()->addMinutes(10));

        $response = $this->post(route('reset-password'), [
            'email' => $user->email,
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertRedirect(route('login'));

        $this->assertTrue(Hash::check('newpassword', $user->fresh()->password));
        $this->assertFalse(Cache::has("otp_{$user->email}"));
    }

    /** @test */
    public function it_requires_password_confirmation() {
        $user = User::factory()->create();

        $response = $this->post(route('reset-password'), [
            'email' => $user->email,
            'password' => 'newpassword',
            'password_confirmation' => 'wrongconfirmation',
        ]);

        $response->assertSessionHasErrors('password');
    }
}