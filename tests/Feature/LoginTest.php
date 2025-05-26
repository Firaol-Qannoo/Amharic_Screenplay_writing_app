<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Script;
use App\Models\ScriptInvitation;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{

    public function test_login_and_accept_invitation()
    {
        // Create a user with known password
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);

        $script = Script::factory()->create();

        // an invitation for the user
        $invitation = ScriptInvitation::factory()->create([
            'script_id' => $script->id,
            'invitee_email' => $user->email,
            'accepted' => false,
        ]);

        // Ensuring user is not yet a collaborator
        $this->assertFalse($script->collaborators->contains($user));

        //  login request
        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        // Refresh data
        $script->refresh();
        $invitation->refresh();

        // Assertions
        $this->assertTrue($script->collaborators->contains($user));
        $this->assertTrue($invitation->accepted);
        $this->assertEquals($invitation->invitee_id, $user->id);
        $response->assertRedirect(route('dashboard'));
    }

    public function test_invalid_login_credentials()
    {
        // Ensure user doesn't exist
        $this->assertDatabaseMissing('users', ['email' => 'nonexistent@example.com']);

        // Attempt login with invalid credentials
        $response = $this->post(route('login'), [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

      
        $this->assertGuest(); 
        $response->assertRedirect(route('login'));
    }
}
