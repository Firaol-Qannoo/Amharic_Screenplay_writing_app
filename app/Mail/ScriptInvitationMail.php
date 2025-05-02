<?php

namespace App\Mail;

use App\Models\ScriptInvitation;
use Illuminate\Mail\Mailable;

class ScriptInvitationMail extends Mailable
{
    public $invitation;

    public function __construct(ScriptInvitation $invitation)
    {
        $this->invitation = $invitation;
    }

    public function build()
    {
        $url = route('invitation.accept', ['token' => $this->invitation->token]);

        return $this->subject('You have been invited to collaborate on a script')
                    ->view('emails.script-invitation')
                    ->with(['url' => $url]);
    }
}
