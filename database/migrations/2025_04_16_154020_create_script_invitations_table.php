<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class CreateScriptInvitationsTable extends Migration
{
    public function up()
    {
        Schema::connection('mongodb')->create('script_invitations', function (Blueprint $collection) {
            $collection->string('script_id');               
            $collection->string('inviter_id');              
            $collection->string('invitee_id')->nullable(); 
            $collection->string('invitee_email');           
            $collection->string('token');                   
            $collection->json('role'); 
            $collection->boolean('accepted')->default(false); 
        
            $collection->timestamps();
        });
    }

    public function down()
    {
        Schema::connection('mongodb')->dropIfExists('script_invitations');
    }
}
