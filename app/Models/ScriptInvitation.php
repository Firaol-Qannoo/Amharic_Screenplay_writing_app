<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; 

class ScriptInvitation extends Model
{
    protected $connection = 'mongodb'; // Ensure it's using MongoDB connection
    protected $collection = 'script_invitations';
    protected $fillable = ['script_id', 'inviter_id', 'invitee_email', 'token', 'accepted'];

    // You can define the MongoDB-specific cast for 'accepted' if needed
    protected $casts = [
        'accepted' => 'boolean',
    ];

    /**
     * The script that this invitation belongs to.
     */
    public function script()
    {
        return $this->belongsTo(Script::class, 'script_id');
    }

    /**
     * The user who sent this invitation (inviter).
     */
    public function inviter()
    {
        return $this->belongsTo(User::class, 'inviter_id');
    }
}
