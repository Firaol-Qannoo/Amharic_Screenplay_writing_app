<?php

namespace App\Http\Controllers;

use App\Models\ScriptInvitation;
use App\Models\Script;
use App\Mail\ScriptInvitationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Flasher\Laravel\Facade\Flasher;

class ScriptInvitationController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'script_id' => 'required|string',
        'invitee_email' => 'required|email',
    ]);

    try {
        // Check if the email belongs to an existing user
        $existingUser = User::where('email', $request->invitee_email)->first();

        if ($existingUser) {
            // Check if this user is already a collaborator on the script
            $script = Script::findOrFail($request->script_id);

            if (in_array((string) $existingUser->_id, $script->collaborators ?? [])) {
                // Log::info("User is already a collaborator on this script.",);
                // return back()->withErrors(['invitee_email' => 'User is already a collaborator on this script.']);
                // return response()->json(['errors' => ['invitee_email' => 'User is already a collaborator on this script.']], 422);
                // return redirect('/dashboard')->with('error', 'User is already a collaborator on this script!');

                //   flash()->error('User is already a collaborator on this script!');
                Flasher::addError('User is already a collaborator on this script!');

                    // Redirect back, and Inertia will handle passing the flash message
                    return Inertia::location(route('dashboard'));
            }
        }

        // Check if the user has already been invited and not accepted yet
        $existingInvitation = ScriptInvitation::where('script_id', $request->script_id)
            ->where('invitee_email', $request->invitee_email)
            ->where('accepted', false)
            ->first();

        if ($existingInvitation) {
            // return back()->withErrors(['invitee_email' => 'This user has already been invited to this script.']);
            // return redirect()->route('dashboard')->with('error', 'This user has already been invited to this script.');
            // return redirect('/dashboard')->with('error', 'This user has already been invited to this script.');
            Flasher::addSuccess('This user has already been invited to this script.');

            // Redirect back, and Inertia will handle passing the flash message
            return Inertia::location(route('dashboard'));
        }

        // Generate a unique token for the invitation link
        $token = Str::random(40);

        // Create the invitation
        $invitation = ScriptInvitation::create([
            'script_id' => $request->script_id,
            'inviter_id' => Auth::id(),
            'invitee_email' => $request->invitee_email,
            'token' => $token,
            'accepted' => false,
        ]);

        Log::info("Invitation created", [
            'script_id' => $request->script_id,
            'invitee_email' => $request->invitee_email,
            'token' => $token
        ]);

        // Send email invitation
        Mail::to($request->invitee_email)->send(new ScriptInvitationMail($invitation));
        Log::info("Invitation email sent to " . $request->invitee_email);

        // return redirect()->route('dashboard')->with('success', 'Invitation sent successfully.');
        Flasher::addSuccess('Invitation sent successfully.');

        // Redirect back, and Inertia will handle passing the flash message
        return Inertia::location(route('dashboard'));

    } catch (Exception $e) {
        Log::error("Error sending invitation: " . $e->getMessage());
        // return back()->withErrors(['invitee_email' => 'Failed to send invitation. Please try again.']);
        Flasher::addError('Failed to send invitation. Please try again.');

        // Redirect back, and Inertia will handle passing the flash message
        return Inertia::location(route('dashboard'));

    }
}

    public function accept($token)
    {
        try {
            $invitation = ScriptInvitation::where('token', $token)->firstOrFail();
            Log::info("Invitation token accessed", ['token' => $token]);

            if ($invitation->accepted) {
                Log::warning("Invitation already accepted", ['token' => $token]);
                // return redirect('dashboard')->with('message', 'Invitation already accepted.');
                Flasher::addInfo('Failed to send invitation. Please try again.');

                // Redirect back, and Inertia will handle passing the flash message
                return Inertia::location(route('dashboard'));
            }

            if (!auth()->check()) {
                Log::info("Unauthenticated user trying to accept invitation", ['token' => $token]);
                session(['invitation_token' => $token]);
                return redirect('/login');
            }

            $script = Script::findOrFail($invitation->script_id);
            Log::info("Script found", ['script_id' => $invitation->script_id]);

            // $script->collaborators = array_unique(array_merge($script->collaborators ?? [], [Auth::id()]));
            // $script->save();

            Log::info("User added to collaborators", [
                'user_id' => Auth::id(),
                'script_id' => $script->_id
            ]);

            $invitation->accepted = true;
            $invitation->save();

            return redirect("/scripts/{$script->_id}")
                ->with('message', 'You’ve joined the script!');
        } catch (Exception $e) {
            Log::error("Error accepting invitation: " . $e->getMessage());
            // return redirect('/dashboard')->with('error', 'Invalid or expired invitation.');
            Flasher::addError('Invalid or expired invitation.');

                // Redirect back, and Inertia will handle passing the flash message
                return Inertia::location(route('dashboard'));
        }
    }
}
