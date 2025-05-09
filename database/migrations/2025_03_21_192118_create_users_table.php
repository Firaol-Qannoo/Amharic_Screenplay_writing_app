<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        // Create the 'users' collection in MongoDB
        Schema::connection('mongodb')->create('users', function (Blueprint $table) {
            $table->id(); 
            $table->string('first_name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('avatar');
            $table->string('role')->default('Owner');
            $table->string('google_id')->nullable(); // google_id as nullable
            $table->string('lang_pref'); 
            $table->timestamps(); 
        });

        // MongoDB Index: unique index on google_id where it exists and is not null
        DB::connection('mongodb')->getCollection('users')->createIndex(
            ['google_id' => 1], // Index on google_id
            [
                'unique' => true,
                'partialFilterExpression' => ['google_id' => ['$exists' => true]]
            ]
        );
    }

    public function down()
    {
        // Drop the 'users' collection from MongoDB
        Schema::connection('mongodb')->dropIfExists('users');

        // MongoDB Index: Drop the index
        DB::connection('mongodb')->getCollection('users')->dropIndex('google_id_1');
    }
};