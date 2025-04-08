<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Script;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ScriptsController extends Controller
{
    public function store(Request $request)
    {
      
        // $request->validate([
        //     'title' => 'required|string|max:255',
        //     'description' => 'required|string',
        //     'genre' => 'required|string',
        //     'type' => 'required|in:Film,Theatre',
        // ]);
        
        
        $script = Script::create([
            'title' => $request->title,
            'description' => $request->description,
            'genre' => $request->genre,
            'type' => $request->type,
            'user_id' => Auth::id(), 
        ]);
 
        $script->save();
    
        session(['script' => $script]);
    
        return redirect()->route('editor');
    }
}
