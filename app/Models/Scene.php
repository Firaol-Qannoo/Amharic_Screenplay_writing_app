<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Scene extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'scenes';

    protected $fillable = [
        'id',
        'scriptID',
        'scene_num',
        'sceneHead',
        'sceneDesc',
        'lines',
        'user', 
    ];

    protected $casts = [
        'lines' => 'array',
        'user' => 'array', 
    ];

    public function characters() {
    return $this->hasMany(Character::class, 'sceneID');
}
}