<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Script;
use App\Models\ScriptInvitation;
use Inertia\Inertia;
use App\Models\User;


   class DashboardController extends Controller {
    
     public function home() {
        return Inertia::render('Landing');
     }


      public function index() {
       
        $userId = Auth::id();    
        $user = Auth::user();  
       
        $user = Auth::user();

        // Fetch the scripts owned by the user
        $myScripts = Script::where('user_id', $user->_id)->with('user')->get();

        // For each owned script, load the full collaborator data
        $myScripts->each(function ($script) {
            $collaboratorIds = $script->invitee_id ?? []; 
            
            if (empty($collaboratorIds)) {
                $script->collaborators_full = collect([]);
                return;
            }
            
            // Fetch the user data for these collaborator IDs
            $collaborators = User::whereIn('_id', $collaboratorIds)->get();

            // Fetch the corresponding invitation details for this script for each collaborator.
            // This returns invitation details with extra info from the pivot table.
            $invitations = ScriptInvitation::where('script_id', $script->_id)
                                ->whereIn('invitee_id', $collaboratorIds)
                                ->get()
                                ->keyBy('invitee_id'); // index by invitee_id for quick access

            // Merge the data—for each collaborator, attach the matching invitation data.
            $collaboratorsFull = $collaborators->map(function ($colUser) use ($invitations) {
                // Adding an attribute called "invitation" to the user data with the pivot details.
                $colUser->invitation = $invitations->get($colUser->_id, null);
                return $colUser;
            });
            
            // Attach the enriched collaborator data to the script (use any property name you want)
            $script->collaborators_full = $collaboratorsFull;
        });

        $invitations = ScriptInvitation::where('invitee_id', $user->_id)
        ->where('accepted', true)
        ->get();
    
       $invitedScripts = Script::whereIn('_id', $invitations->pluck('script_id'))
        ->with('user') 
        ->get();

        // used for debugging
        // dd($invitedScripts);
         
            return Inertia::render('writers/Dashboard/DashboardPage', [
                'myScripts' => $myScripts,
                'invitedScripts' => $invitedScripts,
                'user' =>  $user
                ]);
            }  
        }
