<?php

namespace App\Models;

 use MongoDB\Laravel\Eloquent\Model;

class Character extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'characters';

    protected $fillable = ['id', 'sceneID', 'name', 'role', 'description', 'relationships', 'inScene'];

    protected $casts = [
        'relationships' => 'array', // Automatically cast the 'lines' attribute to an array
    ];

    public function scene()
    {
        return $this->belongsTo(Scene::class, 'sceneID');
    }
   
}
