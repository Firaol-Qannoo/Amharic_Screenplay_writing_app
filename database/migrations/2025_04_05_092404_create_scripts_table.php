<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateScriptsTable extends Migration
{
    public function up()
    {
        Schema::connection('mongodb')->create('scripts', function (Blueprint $table) {
            $table->id(); 
            $table->string('title'); 
            $table->string('description');
            $table->string('genre'); 
            $table->id('user_id'); 
            $table->string('type'); 
            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::connection('mongodb')->dropIfExists('scripts');
    }
}
