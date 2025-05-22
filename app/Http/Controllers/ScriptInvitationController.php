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
            'role.*' => 'in:Writer,Artist,Director',
        ]);
    
        try {
            $currentUser = Auth::user();
    
            if ($request->invitee_email === $currentUser->email) {
                Flasher::addError('You cannot invite yourself to the script.');
                return Inertia::location(url()->previous());
            }
    
            $script = Script::findOrFail($request->script_id);
            $existingUser = User::where('email', $request->invitee_email)->first();
    
            //  New: Check via relationship
            // $alreadyCollaborator = ScriptInvitation::where('script_id', $script->_id)
            //         ->where('invitee_id', $existingUser->_id)
            //         ->where('accepted', true)
            //         ->exists();

            $alreadyCollaborator = false;

                if ($existingUser) {
                    $alreadyCollaborator = ScriptInvitation::where('script_id', $script->_id)
                        ->where('invitee_id', $existingUser->_id)
                        ->where('accepted', true)
                        ->exists();

                    if ($alreadyCollaborator) {
                        Flasher::addError('User is already a collaborator on this script!');
                        return Inertia::location(url()->previous());
                    }
                }
    
            $existingInvitation = ScriptInvitation::where([
                ['script_id', $request->script_id],
                ['invitee_email', $request->invitee_email],
                ['accepted', false]
            ])->first();
    
            if ($existingInvitation) {
                Flasher::addInfo('This user has already been invited to this script.');
                return Inertia::location(url()->previous());
            }
    
            $invitation = ScriptInvitation::create([
                'script_id' => $script->_id,
                'inviter_id' => $currentUser->id,
                'invitee_email' => $request->invitee_email,
                'role' =>  $request->role,
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
            return Inertia::location(url()->previous());
    
        } catch (Exception $e) {
            Log::error("Error sending invitation: " . $e->getMessage());
            Flasher::addError('Failed to send invitation. Please try again.');
            return Inertia::location(url()->previous());
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
            $userId = Auth::id();
            $script = Script::findOrFail($invitation->script_id);
    
            // Assuming _id is used
            $script->collaborators()->syncWithoutDetaching([$userId]);
            $script->save();
    
            $invitation->accepted = true;
            $invitation->invitee_id = Auth::id();
            $invitation->save();
    
            Flasher::addSuccess('You have joined the script.');
            return Inertia::location(route('dashboard'));
    
        } catch (Exception $e) {
            Log::error("Invitation error: " . $e->getMessage());
            Flasher::addError('Invalid or expired invitation.');
            return Inertia::location(route('dashboard'));
        }
    }

    public function deleteCollaborator($scriptId, $userId)
    {
        // 1. Remove userId from invitee_id array in the Script model
        $script = Script::findOrFail($scriptId);
    
        $inviteeIds = is_array($script->invitee_id)
            ? $script->invitee_id
            : json_decode($script->invitee_id, true);
    
        $updatedInvitees = array_filter($inviteeIds, fn($id) => $id !== $userId);
        $updatedInvitees = array_values($updatedInvitees);
    
        $script->invitee_id = $updatedInvitees;
        $script->save();
    
        // 2. Delete all ScriptInvitation records where invitee_id = $userId and script_id = $scriptId (optional filter)
        //  // add if you want to scope[script_id] deletion to this script
        ScriptInvitation::where('invitee_id', $userId)
            ->where('script_id', $scriptId)
            ->delete();
    
        flash()->success('Collaborator deleted successfully!');
        return Inertia::location(route('dashboard'));
    }
    


    public function updateCollaboratorRole(Request $request, $scriptId, $userId)
{
    $request->validate([
        'role' => 'required|array',
        'role.*' => 'string|in:Writer,Artist,Director',
    ]);

    if (empty($request->role)) {
        Flasher::addError('No roles assigned. Please select at least one role.');
        return Inertia::location(route('dashboard'));
    }

    $collaborator = ScriptInvitation::where('invitee_id', $userId)
        ->where('script_id', $scriptId)
        ->first();

    if (!$collaborator) {
        Flasher::addError('Collaborator not found.');
        return Inertia::location(route('dashboard'));
    }

    $collaborator->role = $request->role;
    $collaborator->save();

    flash()->success('Collaborator role changed successfully!');
    return Inertia::location(route('dashboard'));
}

    
}