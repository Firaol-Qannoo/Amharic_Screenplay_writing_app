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
               $locale = auth()->user()->lang_pref ?? 'en';
                app()->setLocale($locale);

                Flasher::addError(__('messages.self_invite_error'));
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
                      $locale = auth()->user()->lang_pref ?? 'en';
                        app()->setLocale($locale);

                        Flasher::addError(__('messages.already_collaborator'));
                        return Inertia::location(url()->previous());
                    }
                }
    
            $existingInvitation = ScriptInvitation::where([
                ['script_id', $request->script_id],
                ['invitee_email', $request->invitee_email],
                ['accepted', false]
            ])->first();
    
            if ($existingInvitation) {
               $locale = auth()->user()->lang_pref ?? 'en';
                app()->setLocale($locale);

                Flasher::addInfo(__('messages.already_invited'));
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
    
          $locale = auth()->user()->lang_pref ?? 'en';
            app()->setLocale($locale);

            Flasher::addSuccess(__('messages.invitation_sent'));
                return Inertia::location(url()->previous());
    
        } catch (Exception $e) {
            Log::error("Error sending invitation: " . $e->getMessage());
           $locale = auth()->user()->lang_pref ?? 'en';
            app()->setLocale($locale);

            Flasher::addError(__('messages.invitation_failed'));
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
               $locale = auth()->user()->lang_pref ?? 'en';
                app()->setLocale($locale);

                Flasher::addInfo(__('messages.invitation_accepted'));
                        return Inertia::location(route('dashboard'));
                    }
            
            $userId = Auth::id();
            $script = Script::findOrFail($invitation->script_id);
    
            $script->collaborators()->syncWithoutDetaching([$userId]);
            $script->save();
    
            $invitation->accepted = true;
            $invitation->invitee_id = Auth::id();
            $invitation->save();
    
            $locale = auth()->user()->lang_pref ?? 'en';
            app()->setLocale($locale);

            Flasher::addSuccess(__('messages.joined_script'));
            return Inertia::location(route('dashboard'));
    
        } catch (Exception $e) {
            Log::error("Invitation error: " . $e->getMessage());
            $locale = auth()->user()->lang_pref ?? 'en';
            app()->setLocale($locale);

            Flasher::addError(__('messages.invalid_invitation'));
                return Inertia::location(route('dashboard'));
            }
    }

    public function deleteCollaborator($scriptId, $userId) {
    
        $script = Script::findOrFail($scriptId);
    
        $inviteeIds = is_array($script->invitee_id)
            ? $script->invitee_id
            : json_decode($script->invitee_id, true);
    
        $updatedInvitees = array_filter($inviteeIds, fn($id) => $id !== $userId);
        $updatedInvitees = array_values($updatedInvitees);
    
        $script->invitee_id = $updatedInvitees;
        $script->save();
    
        ScriptInvitation::where('invitee_id', $userId)
            ->where('script_id', $scriptId)
            ->delete();
    
       $locale = auth()->user()->lang_pref ?? 'en';
        app()->setLocale($locale);

        flash()->success(__('messages.collaborator_deleted'));
             return Inertia::location(route('dashboard'));
    }
    

  public function updateCollaboratorRole(Request $request, $scriptId, $userId) {
    try {
        $validated = $request->validate([
            'role' => 'required|array',
            'role.*' => 'string|in:Writer,Artist,Director',
        ]);

        if (empty($validated['role'])) {
           $locale = auth()->user()->lang_pref ?? 'en';
            app()->setLocale($locale);

            flash()->error(__('messages.no_roles_assigned'));
            return Inertia::location(route('dashboard'));
        }

        $collaborator = ScriptInvitation::where('invitee_id', $userId)
            ->where('script_id', $scriptId)
            ->first();

        if (!$collaborator) {
           $locale = auth()->user()->lang_pref ?? 'en';
            app()->setLocale($locale);

            flash()->error(__('messages.collaborator_not_found'));
            return Inertia::location(route('dashboard'));
        }

        $collaborator->role = $validated['role'];
        $collaborator->save();

        $locale = auth()->user()->lang_pref ?? 'en';
        app()->setLocale($locale);

        flash()->success(__('messages.collaborator_role_changed'));
        return Inertia::location(route('dashboard'));
    } catch (\Illuminate\Validation\ValidationException $e) {
        // flash()->error('Invalid input: ' . $e->getMessage());
        $locale = auth()->user()->lang_pref ?? 'en';
            app()->setLocale($locale);

            flash()->info(__('messages.user_role_required'));
                    return Inertia::location(route('dashboard'));
    } catch (\Exception $e) {
       $locale = auth()->user()->lang_pref ?? 'en';
        app()->setLocale($locale);

        flash()->error(__('messages.update_collaborator_roles_error'));
                return Inertia::location(route('dashboard'));
            }
    }


    
}