<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scene;
use Illuminate\Support\Facades\Validator;
use App\Models\Script;
use Inertia\Inertia;

class SceneController extends Controller
{
    public function index() {
        $script = session('script');  // Retrieve the script from the session
        $script = Script::with('scenes')->findOrFail($script->id);
        // dd( $script );
        return response()->json(['script' => $script]);
    }

    public function store(Request $request, $scriptID) {
        $validator = Validator::make($request->all(), [
            'scenes' => 'required|array',
            'scenes.*.sceneHead' => 'nullable|string',
            'scenes.*.sceneDesc' => 'nullable|string',
            'scenes.*.lines' => 'nullable|array',
            'scenes.*.scene_num' => 'nullable|integer',
            // Add more validation rules as needed for your scene data
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput(); 
        }
        foreach ($request->input('scenes') as $sceneData) {
            $cleanedLines = [];
        
            if (!empty($sceneData['lines']) && is_array($sceneData['lines'])) {
                foreach ($sceneData['lines'] as $line) {
                    if (is_array($line)) {
                        $cleanedLines[] = [
                            'character' => $line['character'] ?? null,
                            'emotion' => $line['emotion'] ?? null,
                            'dialogue' => $line['dialogue'] ?? null,
                            'action' => $line['action'] ?? null,
                        ];
                    }
                }
            }
        
            Scene::create([
                'scriptID' => $scriptID,
                'scene_num' => $sceneData['scene_num'] ?? null,
                'sceneHead' => $sceneData['sceneHead'] ?? null,
                'sceneDesc' => $sceneData['sceneDesc'] ?? null,
                'lines' => $cleanedLines,
            ]);
        }
        
        flash()->success(
            'Scenes Saved successfully!'
        );

        $script = Script::with('scenes')->findOrFail($scriptID);
        return Inertia::render('writers/EditorPage', ['script' => $script]);
    }

   
}
