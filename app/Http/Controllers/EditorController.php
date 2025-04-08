<?php

namespace App\Http\Controllers;

use App\Models\Script;
use Inertia\Inertia;
use Illuminate\Http\Request;

class EditorController extends Controller
{
    public function index(Request $request)
    {
        // Get the script data from the session, if available
        $script = session('script');  // Retrieve the script from the session

        // If no script data is found in the session, you might want to fetch it from the database
        // Example (if needed):
        // $script = Script::find($request->session()->get('script_id'));

        // Pass the script data to the Inertia page
        return Inertia::render('writers/EditorPage', [
            'script' => $script,  // Pass the script to the frontend
        ]);
    }
}

