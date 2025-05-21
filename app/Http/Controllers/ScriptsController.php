<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Script;
use Inertia\Inertia;
use MongoDB\BSON\ObjectId; 
use Illuminate\Support\Facades\Auth;

class ScriptsController extends Controller
{
    public function store(Request $request)
    {

       

        // $validated = $request->validate([
        //     'title' => 'required|string|max:255',
        //     'description' => 'required|string',
        //     'genre' => 'required|string',
        //     'type' => 'required|string',   //'required|in:film,theatre',
        //     'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048', // Validate image
        //     'user_id' => Auth::id(),
        // ]);
    
        // $script = new Script();
        // $script->title = $validated['title'];
        // $script->description = $validated['description'];
        // $script->genre = $validated['genre'];
        // $script->type = $validated['type'];

        $script = Script::create([
            'title' => $request->title,
            'description' => $request->description,
            'genre' => $request->genre,
            'type' => $request->type,
            'user_id' => Auth::id(), 
        ]);
    
        if ($request->hasFile('thumbnail')) {

            $file = $request->file('thumbnail');
        
            $thumbnailName = time() . '_' . $file->getClientOriginalName();
        
            $file->move(public_path('thumbnails'), $thumbnailName); 
        
            $script->thumbnail = 'thumbnails/' . $thumbnailName;
        }
        $script->save();
    
        session(['script' => $script]);

       flash()->success('Your script has been created.');
       return Inertia::location(route('dashboard'));
    }

    public function index()
    {
        // Retrieve all scripts for the authenticated user
        $scripts = Script::where('user_id', Auth::id())->get();

        return Inertia::render('Scripts/Index', [
            'scripts' => $scripts,
        ]);
    }

    public function update(Request $request, $id)
{
    $script = Script::findOrFail($id);

    // Update text fields
    $script->update($request->only(['title', 'description', 'genre']));

    // Handle new thumbnail upload
    if ($request->hasFile('thumbnail')) {
        // Delete old thumbnail if it exists
        if ($script->thumbnail && file_exists(public_path($script->thumbnail))) {
            unlink(public_path($script->thumbnail));
        }

        $file = $request->file('thumbnail');
        $thumbnailName = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('thumbnails'), $thumbnailName);

        $script->thumbnail = 'thumbnails/' . $thumbnailName;
        $script->save();
    }

    flash()->success('Your script has been updated successfully.');
    return Inertia::location(route('dashboard'));
}



    public function destroy($id) {
        $script = Script::findOrFail($id); 
    
        // Delete thumbnail file if it exists
        if ($script->thumbnail && file_exists(public_path($script->thumbnail))) {
            unlink(public_path($script->thumbnail));
        }
    
        $script->delete(); 
    
        flash()->success('Script deleted successfully!');
        return Inertia::location(route('dashboard'));
    }
}
