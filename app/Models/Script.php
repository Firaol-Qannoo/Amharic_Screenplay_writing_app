<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

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
    public function collaboratorUsers()
    {
        $ids = is_array($this->collaborators) ? $this->collaborators : [];
    
        return User::whereIn('_id', $ids)->get();
    }

    public function scenes() {
        return $this->hasMany(Scene::class, 'scriptID');
        // The second argument 'scriptID' is the foreign key on the 'scenes' collection
        // that refers to the _id (or a string-based ID) of the Script model.
    }
}