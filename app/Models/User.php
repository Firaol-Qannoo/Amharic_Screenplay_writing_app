<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Eloquent\Model; // Use MongoDB model
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Model implements Authenticatable
{
    use Notifiable;
    use AuthenticatableTrait;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'first_name',
        'email',
        'password',
        'avatar',
        'google_id',
        'lang_pref',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    protected $attributes = [
        'role' => 'Writer', // Default role
    ];

    public function scripts() {
        return $this->hasMany(Script::class, 'author', '_id');
    }

    // Scripts this user owns
    public function scriptsOwned(): HasMany {
        return $this->hasMany(Script::class, 'user_id');
    }

    // Script invitations where this user was invited
    public function scriptInvitations(): HasMany {
        return $this->hasMany(ScriptInvitation::class, 'invitee_id');
    }

    // Scripts the user was invited to (joined via pivot table)
    public function invitedScripts() {
    return $this->hasManyThrough(Script::class, ScriptInvitation::class, 'invitee_id', '_id', '_id', 'script_id')
                ->where('accepted', true);
    }

 }
