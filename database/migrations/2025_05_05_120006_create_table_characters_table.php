<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('mongodb')->create('characters', function ($collection) {
            
        $collection->string('id');
        $collection->string('sceneID'); 
        $collection->string('name'); 
        $collection->string('role')->nullable();
        $collection->string('description')->nullable();
        $collection->array('relationships')->nullable();  // Storing relationships as an array of objects
        $collection->array('inScene')->nullable();  // Storing inScene as an array
        $collection->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mongodb')->drop('characters');
    }
};
