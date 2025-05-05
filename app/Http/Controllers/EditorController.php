<?php

namespace App\Http\Controllers;

use App\Models\Scene;
use App\Models\Script;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EditorController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $script = session('script');
    
        // If session('script') holds an ID
        $scenes = Scene::where('scriptID', $script->_id)->get();
        
        return Inertia::render('writers/EditorPage', [
            'script' => $script,
            'user' => $user,
            'scenes' => $scenes, // pass the related scenes
        ]);
    }

    public function edit($id) {

        $user = Auth::user();  
        $script = Script::with('scenes')->findOrFail($id);
        // dd( $script);
        return Inertia::render('writers/EditorPage', ['script' => $script,
        'user' => $user]);
        
    }
}