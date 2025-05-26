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
    // Manually create a user
    $user = new \App\Models\User([
        'name' => 'Test User',
        'email' => 'testuser@example.com',
        'password' => \Hash::make('password123'),
    ]);
    $user->save();

    // Manually create a script
    $script = new \App\Models\Script([
        'title' => 'Test Script',
        'description' => 'Test script description',
        // Add any other required fields here
    ]);
    $script->save();

    // Manually create an invitation
    $invitation = new \App\Models\ScriptInvitation([
        'script_id' => $script->id,
        'invitee_email' => $user->email,
        'accepted' => false,
    ]);
    $invitation->save();

    // Ensure user is not yet a collaborator
    $this->assertFalse($script->collaborators->contains($user));

    // Perform login request
    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    // Refresh models
    $script->refresh();
    $invitation->refresh();

    // Assert user was added as collaborator and invitation marked as accepted
    $this->assertTrue($script->collaborators->contains($user));
    $this->assertTrue($invitation->accepted);
    $this->assertEquals($user->id, $invitation->invitee_id);

    // Assert redirect
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
