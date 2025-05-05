<?php

namespace App\Http\Controllers;

use App\Models\Scene;
use App\Models\Script;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SceneController extends Controller
{
    public function index()
    {
        $script = session('script');
        $script = Script::with('scenes')->findOrFail($script->id);

        return response()->json(['script' => $script]);
    }

    public function store(Request $request, $scriptID)
    {
        $validator = Validator::make($request->all(), [
            'scenes' => 'required|array',
            'scenes.*.sceneHead.text' => 'nullable|string',
            'scenes.*.sceneDesc.text' => 'nullable|string',
            'scenes.*.scene_num' => 'nullable|integer',
            'scenes.*.lines' => 'nullable|array',
            'scenes.*.lines.*.character.text' => 'nullable|string',
            'scenes.*.lines.*.dialogue.text' => 'nullable|string',
            'scenes.*.lines.*.emotion.text' => 'nullable|string',
            'scenes.*.lines.*.action.text' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Optionally delete old scenes for re-creation
        Scene::where('scriptID', $scriptID)->delete();

        foreach ($request->input('scenes') as $sceneData) {
            $cleanedLines = [];

            if (!empty($sceneData['lines']) && is_array($sceneData['lines'])) {
                foreach ($sceneData['lines'] as $line) {
                    $cleanedLines[] = [
                        'character' => $line['character']['text'] ?? null,
                        'emotion' => $line['emotion']['text'] ?? null,
                        'dialogue' => $line['dialogue']['text'] ?? null,
                        'action' => $line['action']['text'] ?? null,
                    ];
                }
            }

            Scene::create([
                'scriptID' => $scriptID,
                'scene_num' => $sceneData['scene_num'] ?? null,
                'sceneHead' => $sceneData['sceneHead']['text'] ?? null,
                'sceneDesc' => $sceneData['sceneDesc']['text'] ?? null,
                'lines' => $cleanedLines,
            ]);
        }

        flash()->success('Scenes saved successfully!');

        $script = Script::with('scenes')->findOrFail($scriptID);
        return Inertia::render('writers/EditorPage', ['script' => $script]);
    }
}
