<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class CreateScriptInvitationsTable extends Migration
{
    public function up()
    {
        Schema::connection('mongodb')->create('script_invitations', function (Blueprint $collection) {
            $collection->string('script_id');               // Reference to the script
            $collection->string('inviter_id');              // User who sent the invite
            $collection->string('invitee_email');           // Email of the person being invited
            $collection->string('token');                   // Token for the invitation link
            $collection->boolean('accepted')->default(false); // Whether the invite was accepted

            // Timestamps
            $collection->timestamps();
        });
    }

    public function down()
    {
        Schema::connection('mongodb')->dropIfExists('script_invitations');
    }
}
