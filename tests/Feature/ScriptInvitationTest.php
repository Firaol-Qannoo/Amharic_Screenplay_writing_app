<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Mail;
use App\Mail\ScriptInvitationMail;
use App\Models\User;
use App\Models\Script;
use App\Models\ScriptInvitation;

class ScriptInvitationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        User::truncate();
        Script::truncate();
        ScriptInvitation::truncate();
    }

    public function test_invitation_sent_successfully()
    {
        Mail::fake();

        $user = User::create([
            'name' => 'Sender',
            'email' => 'sender@example.com',
            'password' => bcrypt('password')
        ]);

        $script = Script::create([
            'title' => 'Test Script',
            'description' => 'Sample',
        ]);

        $this->actingAs($user);

        $data = [
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'role' => 'editor',
        ];

        $response = $this->post(route('invitations.store'), $data);

        Mail::assertSent(ScriptInvitationMail::class);

        $this->assertDatabaseHas('script_invitations', [
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'role' => 'editor',
        ]);

        $response->assertRedirect(route('dashboard'));
    }

    public function test_invite_user_to_script_themselves()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'self@example.com',
            'password' => bcrypt('password')
        ]);

        $script = Script::create([
            'title' => 'My Script',
            'description' => 'Just testing',
        ]);

        $this->actingAs($user);

        $data = [
            'script_id' => $script->id,
            'invitee_email' => $user->email,
            'role' => 'editor',
        ];

        $response = $this->post(route('invitations.store'), $data);

        $response->assertSessionHasErrors(['invitee_email']);
        $response->assertRedirect('/');
    }

    public function test_invite_user_already_collaborator()
    {
        $sender = User::create([
            'name' => 'Sender',
            'email' => 'sender@example.com',
            'password' => bcrypt('password')
        ]);

        $invitee = User::create([
            'name' => 'Collaborator',
            'email' => 'collab@example.com',
            'password' => bcrypt('password')
        ]);

        $script = Script::create([
            'title' => 'Existing Script',
            'description' => 'Collab test',
        ]);

        ScriptInvitation::create([
            'script_id' => $script->id,
            'invitee_email' => $invitee->email,
            'accepted' => true,
            'role' => 'editor'
        ]);

        $this->actingAs($sender);

        $data = [
            'script_id' => $script->id,
            'invitee_email' => $invitee->email,
            'role' => 'editor',
        ];

        $response = $this->post(route('invitations.store'), $data);

        $response->assertSessionHasErrors();
        $response->assertRedirect('/');
    }

    public function test_invitation_already_exists_but_not_accepted()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => bcrypt('password')
        ]);

        $script = Script::create([
            'title' => 'Script 1',
            'description' => 'Testing...',
        ]);

        ScriptInvitation::create([
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'accepted' => false,
            'role' => 'editor'
        ]);

        $this->actingAs($user);

        $data = [
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'role' => 'editor',
        ];

        $response = $this->post(route('invitations.store'), $data);

        $response->assertSessionHas('flasher');
        $response->assertRedirect('/');
    }

    public function test_invitation_email_send_failure()
    {
        Mail::shouldReceive('send')->andThrow(new \Exception('Email send failed'));

        $user = User::create([
            'name' => 'Sender',
            'email' => 'testuser@example.com',
            'password' => bcrypt('password')
        ]);

        $script = Script::create([
            'title' => 'Script fail test',
            'description' => '...',
        ]);

        $this->actingAs($user);

        $data = [
            'script_id' => $script->id,
            'invitee_email' => 'invitee@example.com',
            'role' => 'editor',
        ];

        $response = $this->post(route('invitations.store'), $data);

        $response->assertSessionHasErrors();
        $response->assertRedirect('/');
    }
}