<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Script;
use App\Models\Scene;
use App\Models\Character;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;


    class ImportScriptController extends Controller {

        public function store(Request $request)  {
            $data = $request->input('data');

            $imported = $data['script'];
            $script = Script::create([
                'title' => $imported['title'],
                'description' => $imported['description'],
                'genre' => $imported['genre'],
                'type' => $imported['type'],
                'thumbnail' => $imported['thumbnail'],
                'user_id' => Auth::id(), 
                'invitee_id' => $imported['invitee_id'] ?? [], 
            ]);
        
            $scriptID = $script->id;
        
            
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
                        if (!empty($line['user'])) {
                            $cleanedLine['user'] = $line['user'];
                        }
        
                        $cleanedLines[] = $cleanedLine;
                    }
                }
        
                Scene::create([
                    'scriptID' => $scriptID,
                    'scene_num' => $sceneData['scene_num'] ?? null,
                    'sceneHead' => $sceneData['sceneHead'] ?? null,
                    'sceneDesc' => $sceneData['sceneDesc'] ?? null,
                    'user' =>  $sceneData['user'] ?? null,
                    'lines' => $cleanedLines,
                ]);
            }
        
        
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

          
            $totalCharacters = 0;

            $scenes = Scene::where('scriptID', $script->id)->get();

            foreach ($scenes as $scene) {
                $totalCharacters += Str::length($scene->sceneHead['text'] ?? '');
                $totalCharacters += Str::length($scene->sceneDesc['text'] ?? '');

                foreach ($scene->lines as $line) {
                    if (!empty($line['character']['text'])) {
                        $totalCharacters += Str::length($line['character']['text']);
                    }

                    if (!empty($line['emotion']['text'])) {
                        $totalCharacters += Str::length($line['emotion']['text']);
                    }

                    if (!empty($line['dialogue']['text'])) {
                        $totalCharacters += Str::length($line['dialogue']['text']);
                    }

                    if (!empty($line['action']['text'])) {
                        $totalCharacters += Str::length($line['action']['text']);
                    }
                }
            }

            // 1,462 characters = 1 page
            $charactersPerPage = 1462;
            $pages = (int) ceil($totalCharacters / $charactersPerPage);

            Script::where('_id', $scriptID)->update([
                'pages' => $pages
            ]);
        
            flash()->success('Script, Scenes, and Characters imported successfully!');
            return Inertia::location(route('dashboard'));
        }
        
}