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
        'location',
        'time_of_day',
        'time',
        'blocks'
    ];

    protected $casts = [
        'time' => 'datetime',
        'blocks' => 'array'
    ];
}