<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateScriptsTable extends Migration
{
    public function up()
    {
        Schema::connection('mongodb')->create('scripts', function (Blueprint $table) {
            $table->id();  // This creates an auto-incrementing ID field (though MongoDB uses ObjectId, we can leave this if needed)
            $table->string('title'); 
            $table->string('description');
            $table->string('genre'); 
            $table->binary('user_id');  // Use 'binary' type to store ObjectId (MongoDB's default unique identifier)
            $table->string('type'); 
            $table->string('thumbnail');  // Add image field to store the image URL or file path

            // Add the 'collaborators' field: This is an array of ObjectIds
            $table->json('collaborators'); // Store collaborator user IDs (ObjectIds)

            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::connection('mongodb')->dropIfExists('scripts');
    }
}
