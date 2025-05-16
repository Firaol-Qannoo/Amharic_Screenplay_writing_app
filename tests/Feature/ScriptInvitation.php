<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Script;
use App\Models\ScriptInvitation;
use App\Mail\ScriptInvitationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Flasher\Laravel\Facade\Flasher;
use Tests\TestCase;

class ScriptInvitationControllerTest extends TestCase
{
    public function test_invitation_sent_successfully()
    {
        // Fake the email sending
        Mail::fake();

        // Create the user and script
        $user = User::factory()->create();
        $script = Script::factory()->create();

        // Act as the user
        $this->actingAs($user);

        // Data for invitation
        $data = [
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'role' => 'editor',
        ];

        // Send a POST request
        $response = $this->post(route('invitations'), $data);

        // Assert that the invitation email was sent
        Mail::assertSent(ScriptInvitationMail::class);

        // Assert that the invitation was created
        $this->assertDatabaseHas('script_invitations', [
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'role' => 'editor',
        ]);

        // Assert redirection to dashboard
        $response->assertRedirect(route('dashboard'));
    }

    public function test_invite_user_to_script_themselves()
    {
        // Create the user
        $user = User::factory()->create();

        // Act as the user
        $this->actingAs($user);

        // Data where the user is inviting themselves
        $data = [
            'script_id' => 1,
            'invitee_email' => $user->email, // Inviting themselves
            'role' => 'editor',
        ];

        // Send a POST request
        $response = $this->post(route('invitations'), $data);

        // Assert error message and redirection
        $response->assertSessionHasErrors();
        $response->assertRedirect(route('dashboard'));
    }

    public function test_invite_user_already_collaborator()
    {
        // Create a user, script, and collaborator
        $user = User::factory()->create();
        $script = Script::factory()->create();
        $invitee = User::factory()->create();

        // Create existing invitation that has been accepted
        $existingInvitation = ScriptInvitation::factory()->create([
            'script_id' => $script->id,
            'invitee_email' => $invitee->email,
            'accepted' => true,
        ]);

        // Act as the user
        $this->actingAs($user);

        // Data for invitation
        $data = [
            'script_id' => $script->id,
            'invitee_email' => $invitee->email,
            'role' => 'editor',
        ];

        // Send a POST request
        $response = $this->post(route('invitations'), $data);

        // Assert error message and redirection
        $response->assertSessionHasErrors();
        $response->assertRedirect(route('dashboard'));
    }

    public function test_invitation_already_exists_but_not_accepted()
    {
        // Create the user and script
        $user = User::factory()->create();
        $script = Script::factory()->create();

        // Create an existing invitation that's not accepted
        ScriptInvitation::factory()->create([
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'accepted' => false,
        ]);

        // Act as the user
        $this->actingAs($user);

        // Data for invitation
        $data = [
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'role' => 'editor',
        ];

        // Send a POST request
        $response = $this->post(route('invitations'), $data);

        // Assert info message and redirection
        $response->assertSessionHas('flasher')->assertRedirect(route('dashboard'));
    }

    public function test_invitation_email_send_failure()
    {
        // Fake the email sending and simulate failure
        Mail::shouldReceive('send')->andThrow(new \Exception('Email send failed'));

        // Create the user and script
        $user = User::factory()->create();
        $script = Script::factory()->create();

        // Act as the user
        $this->actingAs($user);

        // Data for invitation
        $data = [
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'role' => 'editor',
        ];

        // Send a POST request
        $response = $this->post(route('invitations'), $data);

        // Assert error message and redirection
        $response->assertSessionHasErrors();
        $response->assertRedirect(route('dashboard'));
    }
}
