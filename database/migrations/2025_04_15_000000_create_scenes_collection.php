<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateScenesCollection extends Migration
{
    public function up()
    {
        Schema::connection('mongodb')->create('scenes', function ($collection) { 
            $collection->string('id');      
            $collection->string('scriptID'); 
            $collection->integer('scene_num')->nullable(); 
            $collection->string('sceneHead')->nullable(); 
            $collection->string('sceneDesc')->nullable();
        
            $collection->array('lines')->nullable();    
            
            $collection->object('user')->nullable(); 
        
            $collection->timestamps();
        });
        
    }

    public function down()
    {
        Schema::connection('mongodb')->drop('scenes');
    }
}