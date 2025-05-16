<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Script;
use App\Models\ScriptInvitation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class LoginTest extends TestCase
{
    public function test_login_and_accept_invitation()
    {
        // Create user and script
        $user = User::factory()->create();
        $script = Script::factory()->create();

        // Create an invitation that has not been accepted
        $invitation = ScriptInvitation::factory()->create([
            'script_id' => $script->id,
            'invitee_email' => $user->email,
            'accepted' => false,
        ]);

        $this->actingAs($user);

        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password', 
        ]);

        $script->refresh();
        $this->assertTrue($script->collaborators->contains($user));

        $invitation->refresh();
        $this->assertTrue($invitation->accepted);

        $response->assertRedirect(route('dashboard'));
    }

    public function test_invalid_login_credentials()
    {
        $response = $this->post(route('login'), [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertSessionHasErrors();
        $response->assertRedirect(route('login'));
    }
}
