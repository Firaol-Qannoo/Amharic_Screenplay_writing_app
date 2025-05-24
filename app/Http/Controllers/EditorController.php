<?php

namespace App\Http\Controllers;

use App\Models\Script;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Character;
use App\Models\Scene;
use App\Models\ScriptInvitation;

    class EditorController extends Controller {

        public function index(Request $request)  {
            $user = Auth::user();  
            $script = session('script');  
            return Inertia::render('writers/EditorPage', [
                'script' => $script,  
                'user' => $user,
            ]);
        }

    public function edit($id) {
        $user = Auth::user();  
    
        // Fetch script with scenes
        $script = Script::with('scenes')->findOrFail($id);
    
        // Check ownership
        $isOwner = (string) $script->user_id === (string) $user->_id;
    
        // Fetch invitation if user is not the owner
        $invitation = null;
        if (!$isOwner) {
            $invitation = ScriptInvitation::where('script_id', $id)
                            ->where('invitee_id', $user->_id)
                            ->first();
        }
    
        // Fetch scenes and characters
        $scenes = Scene::where('scriptID', $id)->get();
        $scenecharacters = Character::where('sceneID', $id)->get();
    
        // Prepare user payload
        $userPayload = $user;
        if ($invitation) {
            $userPayload = array_merge($user->toArray(), [
                'invitation' => $invitation,
            ]);
        }

        // dd($user);

        
    
        return Inertia::render('writers/EditorPage', [
            'script' => $script,
            'scenes' => $scenes,
            'user' => $userPayload,
            'scenecharacters' => $scenecharacters,
        ]);
    }
}