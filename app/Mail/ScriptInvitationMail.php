<?php

namespace App\Mail;

use App\Models\ScriptInvitation;
use Illuminate\Mail\Mailable;

use App\Models\Script;
use App\Models\User;

class ScriptInvitationMail extends Mailable
{
    public $invitation;
    public $inviter;
    public $script;

    public function __construct(ScriptInvitation $invitation)
    {
        $this->invitation = $invitation;
        $this->inviter = User::find($invitation->inviter_id);
        $this->script = Script::find($invitation->script_id);
    }

    public function build()
    {
        $url = route('invitation.accept', ['token' => $this->invitation->token]);

        return $this->subject("Invitation to collaborate on '{$this->script->title}'")
                    ->view('emails.script-invitation')
                    ->with([
                        'url' => $url,
                        'inviterName' => $this->inviter->first_name,
                        'scriptTitle' => $this->script->title,
            ]);
    }
}
