<?php

namespace Tests\Feature;


 use Tests\TestCase;
 use App\Models\User;
 use App\Models\Script;
 use Illuminate\Http\UploadedFile;
 use Illuminate\Support\Facades\Storage;
 use Illuminate\Foundation\Testing\RefreshDatabase;
 
 class ScriptCreationTest extends TestCase
 {
     use RefreshDatabase;
 
     /** @test */
     public function authenticated_user_can_create_script_with_thumbnail()
     {
         Storage::fake('public');
 
         $user = User::factory()->create();
         $this->actingAs($user);
 
         $file = UploadedFile::fake()->image('thumbnail.jpg');
 
         $response = $this->post(route('scripts.store'), [
             'title' => 'Test Script',
             'description' => 'This is a test description',
             'genre' => 'Drama',
             'type' => 'Short',
             'thumbnail' => $file,
         ]);
 
         $this->assertDatabaseHas('scripts', [
             'title' => 'Test Script',
             'description' => 'This is a test description',
             'genre' => 'Drama',
             'type' => 'Short',
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
 
         $response = $this->post(route('scripts.store'), [
             'title' => 'Script Without Image',
             'description' => 'No image provided',
             'genre' => 'Comedy',
             'type' => 'Feature',
         ]);
 
         $this->assertDatabaseHas('scripts', [
             'title' => 'Script Without Image',
             'description' => 'No image provided',
             'genre' => 'Comedy',
             'type' => 'Feature',
             'user_id' => $user->id,
         ]);
 
         $script = Script::first();
         $this->assertNull($script->thumbnail);
 
         $response->assertRedirect(route('dashboard'));
     }
 
     /** @test */
     public function unauthenticated_user_cannot_create_script()
     {
         $response = $this->post(route('scripts.store'), [
             'title' => 'Unauthorized Script',
             'description' => 'Should not be created',
             'genre' => 'Horror',
             'type' => 'Short',
         ]);
 
         $response->assertRedirect(route('login'));
         $this->assertDatabaseMissing('scripts', [
             'title' => 'Unauthorized Script',
         ]);
     }
 }
 