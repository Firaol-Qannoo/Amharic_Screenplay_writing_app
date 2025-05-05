<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Script;
use App\Models\ScriptInvitation;
use App\Mail\ScriptInvitationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Flasher\Laravel\Facade\Flasher;
use Exception;

class ScriptInvitationController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'script_id' => 'required|string',
            'invitee_email' => 'required|email',
        ]);

        try {
            $currentUser = Auth::user();

            // Prevent self-invitation
            if ($request->invitee_email === $currentUser->email) {
                Flasher::addError('You cannot invite yourself to the script.');
                return Inertia::location(route('dashboard'));
            }

            $script = Script::findOrFail($request->script_id);

            $existingUser = User::where('email', $request->invitee_email)->first();

            if ($existingUser) {
                // Check if already a collaborator
                if (in_array((string) $existingUser->_id, $script->collaborators ?? [])) {
                    Flasher::addError('User is already a collaborator on this script!');
                    return Inertia::location(route('dashboard'));
                }
            }

            // Check if already invited
            $existingInvitation = ScriptInvitation::where([
                ['script_id', $request->script_id],
                ['invitee_email', $request->invitee_email],
                ['accepted', false]
            ])->first();

            if ($existingInvitation) {
                Flasher::addInfo('This user has already been invited to this script.');
                return Inertia::location(route('dashboard'));
            }

            // Create new invitation
            $invitation = ScriptInvitation::create([
                'script_id' => $script->_id,
                'inviter_id' => $currentUser->id,
                'invitee_email' => $request->invitee_email,
                'token' => Str::random(40),
                'accepted' => false,
            ]);

            Log::info("Invitation created", [
                'script_id' => $script->_id,
                'invitee_email' => $request->invitee_email,
                'token' => $invitation->token
            ]);

            Mail::to($request->invitee_email)->send(new ScriptInvitationMail($invitation));

            Flasher::addSuccess('Invitation sent successfully.');
            return Inertia::location(route('dashboard'));
        } catch (Exception $e) {
            Log::error("Error sending invitation: " . $e->getMessage());
            Flasher::addError('Failed to send invitation. Please try again.');
            return Inertia::location(route('dashboard'));
        }
    }

    public function accept($token) {
        try {
            $invitation = ScriptInvitation::where('token', $token)->firstOrFail();
    
            // If user not logged in, store the token in session and redirect to login
            if (!Auth::check()) {
                session(['invitation_token' => $token]);
                return redirect()->route('login');
            }
    
            // If already accepted, just redirect
            if ($invitation->accepted) {
                Flasher::addInfo('Invitation already accepted.');
                return Inertia::location(route('dashboard'));
            }
    
            // Add user to script collaborators
            $script = Script::findOrFail($invitation->script_id);
    
            // Assuming _id is used
            $script->collaborators = array_unique(array_merge($script->collaborators ?? [], [Auth::id()]));
            $script->save();
    
            $invitation->accepted = true;
            $invitation->save();
    
            Flasher::addSuccess('You have joined the script.');
            return Inertia::location(route('dashboard'));
    
        } catch (Exception $e) {
            Log::error("Invitation error: " . $e->getMessage());
            Flasher::addError('Invalid or expired invitation.');
            return Inertia::location(route('dashboard'));
        }
    }
}