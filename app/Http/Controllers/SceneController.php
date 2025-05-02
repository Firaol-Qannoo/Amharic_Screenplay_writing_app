<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scene;

class SceneController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'scriptID' => 'required|string',
            'scene_num' => 'required|integer',
            'location' => 'required|string',
            'time_of_day' => 'required|string',
            'time' => 'required|date',
            'blocks' => 'required|array',
            'blocks.*.type' => 'required|string',
            'blocks.*.text' => 'required|string',
            'blocks.*.style' => 'nullable|array',
            'blocks.*.position' => 'nullable|array'
        ]);

        $scene = Scene::create($validated);

        return response()->json([
            'message' => 'Scene stored successfully.',
            'scene' => $scene
        ], 201);
    }

    public function show($id)
    {
        $scene = Scene::findOrFail($id);
        return response()->json($scene);
    }
}
