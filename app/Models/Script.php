<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; 

class Script extends Model
{
    //
    protected $connection = 'mongodb';
    protected $collection = 'scripts';

    protected $fillable = [
        'title',
        'description',
        'genre',
        'type',     // film or theatre
        // 'author',   // user ID
    ];

    public function user() {
    return $this->belongsTo(User::class, 'author', '_id');
 }
}
