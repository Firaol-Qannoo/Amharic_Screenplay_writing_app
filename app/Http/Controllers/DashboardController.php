<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Script;
use App\Models\ScriptInvitation;
use Inertia\Inertia;
use App\Models\User;


class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $user = Auth::user();


        // $myScripts = Script::where('user_id', $userId)->get()->map(function ($script) {
        //     return [
        //         'id' => $script->_id,
        //         'title' => $script->title,
        //         'description' => $script->description,
        //         'genre' => $script->genre,
        //         'type' => $script->type,
        //         'thumbnail' => $script->thumbnail,
        //         'user_id' => $script->user_id,
        //         'collaborators' => $script->collaboratorUsers() ?? [], // fallback to empty array
        //         'created_at' => $script->created_at,
        //         'updated_at' => $script->updated_at,
        //     ];
        // });

        // // Scripts where the user is a collaborator (but not the owner)
        // $invitedScripts = Script::with('user:id,first_name,email') // Only load specific user fields
        //     ->where('collaborators', 'all', [(string) $userId])
        //     ->where('user_id', '!=', $userId)
        //     ->get();

        // Fetch the scripts owned by the user
        // $myScripts = $user->scriptsOwned;

        $user = Auth::user();

        // Fetch the scripts owned by the user
        $myScripts = Script::where('user_id', $user->_id)->with('user')->get();

        // For each owned script, load the full collaborator data
        $myScripts->each(function ($script) {
            // dd($script->_id);
            // Step 1: Get the list of collaborator user IDs from the script.
            // (This field should be an array field stored in your script document.)
            $collaboratorIds = $script->invitee_id ?? [];

            if (empty($collaboratorIds)) {
                // No collaborators—attach an empty collection (or array) and continue.
                $script->collaborators_full = collect([]);
                return;
            }

            // Step 2: Fetch the user data for these collaborator IDs
            $collaborators = User::whereIn('_id', $collaboratorIds)->get();

            // Step 3: Fetch the corresponding invitation details for this script for each collaborator.
            // This returns invitation details with extra info from the pivot table.
            $invitations = ScriptInvitation::where('script_id', $script->_id)
                ->whereIn('invitee_id', $collaboratorIds)
                ->get()
                ->keyBy('invitee_id'); // index by invitee_id for quick access

            // Step 4: Merge the data—for each collaborator, attach the matching invitation data.
            $collaboratorsFull = $collaborators->map(function ($colUser) use ($invitations) {
                // Add an attribute called "invitation" to the user data with the pivot details.
                $colUser->invitation = $invitations->get($colUser->_id, null);
                return $colUser;
            });

            // Attach the enriched collaborator data to the script (use any property name you want)
            $script->collaborators_full = $collaboratorsFull;
        });

        // Now, $myScripts contains each script along with a property "collaborators_full"
        // that holds the full user data plus invitation details.
        // dd($myScripts);


        $invitations = ScriptInvitation::where('invitee_id', $user->_id)
            ->where('accepted', true)
            ->get();

        $invitedScripts = Script::whereIn('_id', $invitations->pluck('script_id'))
            ->with('user')
            ->get();
        // dd($invitedScripts);

        $allScripts = Script::all()->map(function ($script) {
            return [
                'id' => $script->_id,
                'title' => $script->title,
            ];
        });

        return Inertia::render('writers/Dashboard/DashboardPage', [
            'myScripts' => $myScripts,
            'invitedScripts' => $invitedScripts,
            'user' =>  $user,
            'allScripts' => $allScripts,
            // 'success' => 'Login successfully.',
        ]);
    }
}
