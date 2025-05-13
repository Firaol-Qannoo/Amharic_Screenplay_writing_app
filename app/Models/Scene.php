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
    ];

    protected $casts = [
        'lines' => 'array', // Automatically cast the 'lines' attribute to an array
    ];

    public function characters() {
    return $this->hasMany(Character::class, 'sceneID');
}
}