<?php

namespace Tests\Feature;


 use Tests\TestCase;
 use App\Models\User;
 use App\Models\Script;
 use Illuminate\Http\UploadedFile;
 use Illuminate\Support\Facades\Storage;
 
 class ScriptCreationTest extends TestCase
 {

     public function authenticated_user_can_create_script_with_thumbnail()
     {
         Storage::fake('public');
 
         $user = User::factory()->create();
         $this->actingAs($user);
 
         $file = UploadedFile::fake()->image('thumbnail.jpg');
 
         $response = $this->post(route('scripts'), [
             'title' => 'Test Script',
             'description' => 'This is a test description',
             'genre' => 'Drama',
             'type' => 'Film',
             'thumbnail' => $file,
         ]);
 
         $this->assertDatabaseHas('scripts', [
             'title' => 'Test Script',
             'description' => 'This is a test description',
             'genre' => 'Drama',
             'type' => 'Film',
             'user_id' => $user->id,
         ]);
 
         $script = Script::first();
         $this->assertNotNull($script->thumbnail);
         $this->assertFileExists(public_path($script->thumbnail));
 
         $response->assertRedirect(route('dashboard'));
     }
 
     /** @test */
     public function authenticated_user_can_create_script_without_thumbnail()
     {
         $user = User::factory()->create();
         $this->actingAs($user);
 
         $response = $this->post(route('scripts'), [
             'title' => 'Script Without Image',
             'description' => 'No image provided',
             'genre' => 'Comedy',
             'type' => 'Film',
         ]);
 
         $this->assertDatabaseHas('scripts', [
             'title' => 'Script Without Image',
             'description' => 'No image provided',
             'genre' => 'Comedy',
             'type' => 'Film',
             'user_id' => $user->id,
         ]);
 
         $script = Script::first();
         $this->assertNull($script->thumbnail);
 
         $response->assertRedirect(route('dashboard'));
     }
 
     /** @test */
   public function test_unauthenticated_user_cannot_create_script()
    {
        // No login

        $response = $this->post(route('scripts'), [
            'title' => 'Unauthorized Script',
            'user_id' => null, 
            'description' => 'Should not be created',
            'genre' => 'Horror',
            'type' => 'Film',
        ]);

        // Assert unauthenticated users are redirected to login
        $response->assertRedirect(route('login'));

        // Assert script is not created in the database
        $this->assertDatabaseMissing('scripts', [
            'title' => 'Unauthorized Script',
        ]);
    }

 }
 