<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Storyboard extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'storyboards';

    protected $fillable = [
        'sceneID',
        'scriptID',
        'image_ur',
        'desc'
    ];

    // Relationship with Script
    public function script()
    {
        return $this->belongsTo(Script::class, 'scriptID', '_id');
    }

    // Relationship with Scene
    public function scene()
    {
        return $this->belongsTo(Scene::class, 'sceneID', '_id');
    }
} 