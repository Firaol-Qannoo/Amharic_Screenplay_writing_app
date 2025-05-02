<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ProductionScene extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'production_scenes';

    protected $fillable = [
        'scene_num',
        'location_type',
        'location',
        'description',
        'time_of_day',
        'cast_ids',
        'shoot_location',
        'pages',
    ];

    protected $casts = [
        'cast_ids' => 'array',
    ];
}
