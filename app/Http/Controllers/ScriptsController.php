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

        // dd(Auth::id()); 
        // dd($request->type);
       
    //   $userId = new ObjectId(Auth::id());

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
        
            $file->move(public_path('thumbnails'), $thumbnailName); // moves to public/thumbnails
        
            $script->thumbnail = 'thumbnails/' . $thumbnailName;
        }
        $script->save();
    
        session(['script' => $script]);

       flash()->success('Welcome to our application! Your script has been created.');
       return Inertia::location(route('editor'));
        // return redirect()->route('editor');
    }

    public function index()
    {
        // Retrieve all scripts for the authenticated user
        $scripts = Script::where('user_id', Auth::id())->get();

        return Inertia::render('Scripts/Index', [
            'scripts' => $scripts,
        ]);
    }

    public function destroy($id) {
        // The $script variable here will automatically be resolved
        // by route model binding if  it set up.
        // Otherwise,  can fetch it manually:
        // $script = Script::findOrFail($request->route('script'));

        $script = Script::findOrFail($id); // Find script or fail with 404
        $script->delete(); // Delete the script

        $scripts = Script::latest()->get();

        // Re-render the Dashboard component with the updated data
        // return Inertia::render('writers/Dashboard/DashboardPage', [
        //     'scripts' => $scripts,
        //     'success' => 'Script deleted successfully.', // Optional success message
        // ]);
        
        flash()->success('Script deleted successfully!');
       return Inertia::location(route('dashboard'));
    }
}
