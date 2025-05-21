<?php

namespace App\Http\Controllers;

use App\Models\Storyboard;
use App\Models\Script;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoryboardController extends Controller
{
    public function index(Request $request, $scriptID = null)
    {
        $user = Auth::user();
        $query = Storyboard::query();

        if ($scriptID) {
            // Get storyboard cells for a specific script
            $query->where('scriptID', $scriptID);
        } else {
            // Get all storyboard cells for scripts the user has access to
            $userScriptIds = Script::where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('collaborators', $user->id);
            })->pluck('_id');
            
            $query->whereIn('scriptID', $userScriptIds);
        }

        $storyboardCells = $query->get();
        $scenes = $scriptID ? Script::find($scriptID)->scenes : [];
            
            return Inertia::render('drawer/storyboard', [
                'storyboardCells' => $storyboardCells,
            'scriptID' => $scriptID,
                'scenes' => $scenes,
                'auth' => [
                'user' => $user
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }



    
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
            'sceneID' => 'required|string',
            'scriptID' => 'required|string',
            'image_ur' => 'nullable|string',
            'desc' => 'nullable|string',
        ]);

            // Handle base64 image if present
            if (!empty($validated['image_ur']) && Str::startsWith($validated['image_ur'], 'data:image')) {
                $validated['image_ur'] = $this->saveBase64Image($validated['image_ur']);
            }

            $storyboard = Storyboard::create($validated);

            return redirect()->back()->with('success', 'Storyboard cell created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create storyboard cell: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'sceneID' => 'required|string',
                'scriptID' => 'required|string',
                'image_ur' => 'nullable|string',
                'desc' => 'nullable|string',
            ]);

            // Handle base64 image if present
            if (!empty($validated['image_ur']) && Str::startsWith($validated['image_ur'], 'data:image')) {
                $validated['image_ur'] = $this->saveBase64Image($validated['image_ur']);
            }

            $storyboard = Storyboard::findOrFail($id);
            $storyboard->update($validated);

            return redirect()->back()->with('success', 'Storyboard cell updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update storyboard cell: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $storyboard = Storyboard::findOrFail($id);
            
            // Delete the image file if it exists
            if ($storyboard->image_ur && !Str::startsWith($storyboard->image_ur, 'data:image')) {
                $path = str_replace('/storage/', 'public/', $storyboard->image_ur);
                Storage::delete($path);
            }
            
        $storyboard->delete();

            return redirect()->back()->with('success', 'Storyboard cell deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete storyboard cell: ' . $e->getMessage());
        }
    }

    private function saveBase64Image($base64)
    {
        $image = str_replace(' ', '+', $base64);
        $imageName = 'storyboard_' . time() . '_' . Str::random(8) . '.png';
        $imagePath = 'public/storyboards/' . $imageName;
        $imageData = explode(',', $image, 2)[1] ?? '';
        Storage::put($imagePath, base64_decode($imageData));
        return Storage::url('storyboards/' . $imageName);
    }

    public function generateImage(Request $request)
    {
        try {
            $validated = $request->validate([
                'prompt' => 'required|string',
                'scriptID' => 'required|string'
            ]);

            // For now, return a placeholder image
            // TODO: Implement actual AI image generation
            return response()->json([
                'success' => true,
                'image_url' => 'https://placehold.co/800x600/87ceeb/fff?text=AI+Generated'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate image: ' . $e->getMessage()
            ], 500);
        }
    }
} 