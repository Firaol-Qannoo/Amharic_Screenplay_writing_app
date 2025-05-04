<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scene;
use Illuminate\Support\Facades\Validator;
use App\Models\Script;
use Inertia\Inertia;

class SceneController extends Controller
{
    /**
     * Display a listing of scenes for a specific script.
     *
     * @param  string  $scriptID
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $script = session('script');  // Retrieve the script from the session
        $script = Script::with('scenes')->findOrFail($script->id);
        return response()->json(['script' => $script]);
    }

    /**
     * Store a newly created scene.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    // ... (other methods like index, show, destroy)

    /**
     * Store newly created scenes for a script.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $scriptID
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
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
            return back()->withErrors($validator)->withInput(); // Redirect back with errors
        }

        foreach ($request->input('scenes') as $sceneData) {
            Scene::create([
                'scriptID' => $scriptID,
                'scene_num' => $sceneData['scene_num'] ?? null,
                'sceneHead' => $sceneData['sceneHead'] ?? null,
                'sceneDesc' => $sceneData['sceneDesc'] ?? null,
                'lines' => $sceneData['lines'] ?? [],
            ]);
        }

        flash()->success(
            'Scenes Saved successfully!'
        );

        $script = Script::with('scenes')->findOrFail($scriptID);
        return Inertia::render('writers/EditorPage', ['script' => $script]);
    }

    /**
     * Display the specified scene.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        $scene = Scene::findOrFail($id);
        return response()->json(['scene' => $scene]);
    }

    /**
     * Update the specified scene.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        $scene = Scene::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'scriptID' => 'nullable|string',
            'scene_num' => 'nullable|integer',
            'sceneHead' => 'nullable|string',
            'sceneDesc' => 'nullable|string',
            'lines' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $scene->update($request->all());
        return response()->json(['scene' => $scene]);
    }

    /**
     * Remove the specified scene.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        $scene = Scene::findOrFail($id);
        $scene->delete();
        return response()->json(['message' => 'Scene deleted successfully']);
    }
}
