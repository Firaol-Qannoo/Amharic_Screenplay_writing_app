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

        $script = Script::create([
            'title' => $request->title,
            'description' => $request->description,
            'genre' => $request->genre,
            'genre' => $request->genre,
            'template' => $request->template,
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

        $locale = auth()->user()->lang_pref ?? 'en';
        app()->setLocale($locale);

        flash()->success(__('messages.script_created'));
        return Inertia::location(route('dashboard'));
    }


    public function update(Request $request, $id)
    {
        $script = Script::findOrFail($id);

        $script->update($request->only(['title', 'description', 'genre']));

        if ($request->hasFile('thumbnail')) {
            if ($script->thumbnail && file_exists(public_path($script->thumbnail))) {
                unlink(public_path($script->thumbnail));
            }

            $file = $request->file('thumbnail');
            $thumbnailName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('thumbnails'), $thumbnailName);

            $script->thumbnail = 'thumbnails/' . $thumbnailName;
            $script->save();
        }

        $locale = auth()->user()->lang_pref ?? 'en';
        app()->setLocale($locale);

        flash()->success(__('messages.script_updated'));
        return Inertia::location(route('dashboard'));
    }



    public function destroy($id)
    {
        $script = Script::findOrFail($id);

        // Delete thumbnail file if it exists
        // if ($script->thumbnail && file_exists(public_path($script->thumbnail))) {
        //     unlink(public_path($script->thumbnail));
        // }

        $script->delete();

        $locale = auth()->user()->lang_pref ?? 'en';
        app()->setLocale($locale);
        flash()->success(__('messages.script_deleted'));
        return Inertia::location(route('dashboard'));
    }
}
