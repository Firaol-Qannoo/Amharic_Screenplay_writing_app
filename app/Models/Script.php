<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Script extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'scripts';

    protected $fillable = [
        'title',
        'description',
        'genre',
        'type',
        'user_id',
        'thumbnail',
        'pages',
        'collaborators', 
    ];

    public function user()  {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    // Optional: Get collaborator users
    public function collaboratorUsers() {
        $ids = is_array($this->invitee_id) ? $this->invitee_id : [];
    
        return User::whereIn('_id', $ids)->get();
    }

    public function scenes() {
        return $this->hasMany(Scene::class, 'scriptID');
    }


    
    public function owner(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function invitations(): HasMany {
        return $this->hasMany(ScriptInvitation::class, 'script_id');
    }

    // All collaborators (invited users)
    public function collaborators(): BelongsToMany {
    return $this->belongsToMany(User::class, 'script_invitations', 'script_id', 'invitee_id')
        ->withPivot('role', 'accepted')
        ->withTimestamps();
    }

    }