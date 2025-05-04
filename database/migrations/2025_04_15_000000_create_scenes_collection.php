<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateScenesCollection extends Migration
{
    public function up()
    {
        Schema::connection('mongodb')->create('scenes', function ($collection) {
            $collection->index('scriptID');
            $collection->index('sceneHead'); // Index for scene heading
            $collection->index('scene_num');
            $collection->index('location');
            $collection->index('time_of_day');

            // The actual content and metadata for the scene will be stored within each document
            $collection->string('scriptID'); // ID of the script this scene belongs to
            $collection->integer('scene_num')->nullable(); // Optional scene number
            $collection->string('sceneHead')->nullable(); // The scene heading (e.g., INT. COFFEE SHOP - DAY)
            $collection->string('sceneDesc')->nullable(); // Description of the scene

            // Array to store the lines of dialogue and actions within the scene
            $collection->array('lines')->nullable();
            // Each element in the 'lines' array will be an object like:
            // {
            //     'type': 'character' | 'emotion' | 'dialogue' | 'action',
            //     'content': 'The actual text content',
            //     // Add any other metadata specific to a line here
            //     'character': 'CHARACTER NAME', // If type is 'character' or 'dialogue'
            //     'emotion': 'Excited',        // If type is 'emotion'
            // }

            // Timestamps: created_at, updated_at
            $collection->timestamps();
        });
    }

    public function down()
    {
        Schema::connection('mongodb')->drop('scenes');
    }
}