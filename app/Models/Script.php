<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Script extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'scripts';

    protected $fillable = [
        'title',
        'description',
        'genre',
        'type',
        'user_id',
        'thumbnail',
        'collaborators',
    ];

    public function user()
    {
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


    // The owner of the script
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // All invitations related to this script
    public function invitations(): HasMany
    {
        return $this->hasMany(ScriptInvitation::class, 'script_id');
    }

    // All collaborators (invited users)
    public function collaborators(): BelongsToMany {
    return $this->belongsToMany(User::class, 'script_invitations', 'script_id', 'invitee_id')
        ->withPivot('role', 'accepted')
        ->withTimestamps();
}

}