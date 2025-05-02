<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Script;
use Inertia\Inertia;
use App\Models\User;


class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
    
        // Scripts created by the user

        $user = Auth::user();  // Get the currently authenticated user
        // dd($user);
       

        $myScripts = Script::where('user_id', $userId)->get()->map(function ($script) {
            return [
                'id' => $script->_id,
                'title' => $script->title,
                'description' => $script->description,
                'genre' => $script->genre,
                'type' => $script->type,
                'thumbnail' => $script->thumbnail,
                'user_id' => $script->user_id,
               'collaborators' => $script->collaboratorUsers() ?? [], // fallback to empty array
                'created_at' => $script->created_at,
                'updated_at' => $script->updated_at,
            ];
        });
    
        // Scripts where the user is a collaborator (but not the owner)
        $invitedScripts = Script::with('user:id,first_name,email') // Only load specific user fields
            ->where('collaborators', 'all', [(string) $userId])
            ->where('user_id', '!=', $userId)
            ->get();

        return Inertia::render('writers/Dashboard/DashboardPage', [
            'myScripts' => $myScripts,
            'invitedScripts' => $invitedScripts,
            'user' =>  $user
            // 'success' => 'Login successfully.',
            ]);
        }  
    }
