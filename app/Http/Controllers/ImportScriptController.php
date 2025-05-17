<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Script;
use App\Models\Scene;
use App\Models\Character;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ImportScriptController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->input('data'); // ✅ Top-level 'data'

          $imported = $data['script'];
        // Create the main script record
        $script = Script::create([
            'title' => $imported['title'],
            'description' => $imported['description'],
            'genre' => $imported['genre'],
            'type' => $imported['type'],
            'thumbnail' => $imported['thumbnail'],
            'user_id' => Auth::id(), // Use the current authenticated user
        ]);
    
        $scriptID = $script->id;
    
        // Create scenes (from top-level "scenes" key)
        foreach ($data['scenes'] as $sceneData) {
            $cleanedLines = [];
    
            if (!empty($sceneData['lines']) && is_array($sceneData['lines'])) {
                foreach ($sceneData['lines'] as $line) {
                    $cleanedLine = [];
    
                    if (!empty($line['lineId'])) {
                        $cleanedLine['lineId'] = $line['lineId'];
                    }
                    if (!empty($line['character'])) {
                        $cleanedLine['character'] = $line['character'];
                    }
                    if (!empty($line['emotion'])) {
                        $cleanedLine['emotion'] = $line['emotion'];
                    }
                    if (!empty($line['dialogue'])) {
                        $cleanedLine['dialogue'] = $line['dialogue'];
                    }
                    if (!empty($line['action'])) {
                        $cleanedLine['action'] = $line['action'];
                    }
    
                    $cleanedLines[] = $cleanedLine;
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
    
        // Create characters (from top-level "characters" key)
        foreach ($data['characters'] as $characterData) {
            Character::create([
                'name' => $characterData['name'],
                'sceneID' => $scriptID,
                'role' => $characterData['role'] ?? null,
                'description' => $characterData['description'] ?? null,
                'relationships' => $characterData['relationships'] ?? [],
                'inScene' => $characterData['inScene'] ?? [],
            ]);
        }
    
        flash()->success('Script, Scenes, and Characters imported successfully!');
        return Inertia::location(route('dashboard'));
    }
    
}