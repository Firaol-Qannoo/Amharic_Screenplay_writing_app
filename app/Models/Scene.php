<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Scene extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'scenes';

    protected $fillable = [
        'id',
        'scriptID',
        'scene_num',
        'sceneHead',
        'sceneDesc',
        'comments',
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