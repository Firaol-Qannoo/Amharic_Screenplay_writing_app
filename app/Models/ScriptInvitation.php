<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; 
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScriptInvitation extends Model
{
    protected $connection = 'mongodb'; // Ensure it's using MongoDB connection
    protected $collection = 'script_invitations';
 
    protected $fillable = [
        'script_id', 
        'inviter_id', 
        'invitee_id',
        'invitee_email', 
        'token', 
        'role', 
        'accepted'];

        

    
    protected $casts = [
        'accepted' => 'boolean',
        'role' => 'array',
    ];

    // The script that this invitation belongs to.
    public function script(): BelongsTo {
        return $this->belongsTo(Script::class, 'script_id');
    }

    public function invitee(): BelongsTo {
        return $this->belongsTo(User::class, 'invitee_id');
    }

    public function inviter(): BelongsTo {
        return $this->belongsTo(User::class, 'inviter_id');
    }
}
