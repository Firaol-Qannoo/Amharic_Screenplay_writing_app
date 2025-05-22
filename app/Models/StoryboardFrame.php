<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class StoryboardFrame extends Model
{
protected $connection = 'mongodb';
protected $collection = 'storyboard_frames';

protected $fillable = [
'script_id',
'scene_json_id',
'image_data',
'notes'
];

protected $casts = [
'image_data' => 'string',
'notes' => 'string'
];
}