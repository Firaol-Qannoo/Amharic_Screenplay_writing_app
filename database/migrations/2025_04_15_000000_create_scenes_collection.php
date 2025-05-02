<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateScenesCollection extends Migration
{
    public function up()
    {
        Schema::connection('mongodb')->create('scenes', function ($collection) {
            // Indexes for faster searching
            $collection->index('scriptID');
            $collection->index('scene_num');
            $collection->index('location');
            $collection->index('time_of_day');

            // Timestamps: created_at, updated_at
            $collection->timestamps();
        });
    }

    public function down()
    {
        Schema::connection('mongodb')->drop('scenes');
    }
}
