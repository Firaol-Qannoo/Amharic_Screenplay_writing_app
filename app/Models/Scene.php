<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; // Use MongoDB model

class Scene extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'scenes';

    protected $fillable = [
        'scriptID',
        'scene_num',
        'sceneHead',
        'sceneDesc',
        'lines',
    ];

    protected $casts = [
        'lines' => 'array', // Automatically cast the 'lines' attribute to an array
    ];
}