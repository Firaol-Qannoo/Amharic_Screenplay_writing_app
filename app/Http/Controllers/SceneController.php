<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scene;
use Illuminate\Support\Facades\Validator;
use App\Models\Script;
use App\Models\Character;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SceneController extends Controller
{
    public function index() {
        $script = session('script');  // Retrieve the script from the session
        $script = Script::with('scenes')->findOrFail($script->id);
        // dd( $script );
        return response()->json(['script' => $script]);
    }

    public function store(Request $request, $scriptID) {

        $user = Auth::user();

        // Fetch scenes and characters
            $scenes = Scene::where('scriptID', $scriptID)->get();
            $sceneCharacters = Character::where('sceneID', $scriptID)->get();

            // Delete them
            $scenes->each->delete();
            $sceneCharacters->each->delete();
    
        // Save the scenes
        foreach ($request->input('scenes') as $sceneData) {
            $cleanedLines = [];
            $sceneId = $sceneData['id'] ?? null;
    
            if (!empty($sceneData['lines']) && is_array($sceneData['lines'])) {
                foreach ($sceneData['lines'] as $line) {
                    $cleanedLine = [];
    
                    if (!empty($line['lineId'])) {
                        $cleanedLine['lineId'] = $line['lineId'];
                    }
    
                    if (!empty($line['character'])) {
                        $cleanedLine['character'] = $line['character']; // contains both id & text
                    }
    
                    if (!empty($line['emotion'])) {
                        $cleanedLine['emotion'] = $line['emotion']; // contains both id & text
                    }
    
                    if (!empty($line['dialogue'])) {
                        $cleanedLine['dialogue'] = $line['dialogue']; // contains both id & text
                    }
    
                    if (!empty($line['action'])) {
                        $cleanedLine['action'] = $line['action']; // contains both id & text
                    }
    
                    $cleanedLines[] = $cleanedLine;
                }
            }

            $user = Auth::user();
            Scene::create([
                'id' => $sceneId,
                'scriptID' => $scriptID,
                'scene_num' => $sceneData['scene_num'] ?? null,
                'sceneHead' => $sceneData['sceneHead'] ?? null, 
                'sceneDesc' => $sceneData['sceneDesc'] ?? null, 
                'lines' => $cleanedLines,
                'user' => $sceneData['user'],
            ]);
            
        }
    
        // Save character data
        if (!empty($request->input('characters'))) {
            foreach ($request->input('characters') as $characterData) {
                Character::create([
                    'id' => $characterData['id'],
                    'sceneID' => $scriptID, 
                    'name' => $characterData['name'] ?? null,
                    'role' => $characterData['role'] ?? null,
                    'description' => $characterData['description'] ?? null,
                    'relationships' => $characterData['relationships'] ?? [],
                    'inScene' => $characterData['inScene'] ?? [],
                ]);
            }
        }
    
        flash()->success('Scenes and Characters saved successfully!');
        return Inertia::location(url()->previous());
    }


    

    public function updateCharacters(array $characters, $scriptID)
    {
        foreach ($characters as $characterData) {
            if (empty($characterData['_id'])) {
                continue; 
            }
    
            $character = Character::where('id', $characterData['id'])
                                  ->where('sceneID', $scriptID) 
                                  ->first();
    
            if ($character) {
                // Update existing character
                $character->update([
                    'name' => $characterData['name'] ?? $character->name,
                    'role' => $characterData['role'] ?? $character->role,
                    'description' => $characterData['description'] ?? $character->description,
                    'relationships' => $characterData['relationships'] ?? $character->relationships,
                    'inScene' => $characterData['inScene'] ?? $character->inScene,
                ]);
            } else {
                // Optional: create if not found
                // Character::create([
                //     'id' => $characterData['id'],
                //     'sceneID' => $scriptID,
                //     'name' => $characterData['name'] ?? null,
                //     'role' => $characterData['role'] ?? null,
                //     'description' => $characterData['description'] ?? null,
                //     'relationships' => $characterData['relationships'] ?? [],
                //     'inScene' => $characterData['inScene'] ?? [],
                // ]);
            }
        }
    }
    
}
