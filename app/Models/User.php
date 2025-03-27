<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Eloquent\Model; // Use MongoDB model

class User extends Model implements Authenticatable
{
    use Notifiable;
    use AuthenticatableTrait;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'first_name', 'last_name', 'email', 'password',
    ];

    protected $hidden = [
        'password',
    ];
}
