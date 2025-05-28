<?php

namespace Tests\Feature;

use App\Models\Scene;
use App\Models\Character;
use App\Models\Script;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SceneControllerTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        DB::connection('mongodb')->getCollection('scenes')->deleteMany([]);
        DB::connection('mongodb')->getCollection('characters')->deleteMany([]);
        DB::connection('mongodb')->getCollection('scripts')->deleteMany([]);
    }

    public function test_store_scenes_and_characters_successfully()
    {
        $script = Script::create(['id' => 'script_test_1', 'title' => 'Test Script']);

        $data = [
            'scenes' => [
                [
                    'id' => 'scene1',
                    'scene_num' => 1,
                    'sceneHead' => [
                        'id' => 'scene_head_1',
                        'text' => 'Scene Heading'
                    ],
                    'sceneDesc' => [
                        'id' => 'scene_desc_1',
                        'text' => 'Scene description here'
                    ],
                    'lines' => [
                        [
                            'lineId' => 'line_1',
                            'character' => [
                                'id' => 'char_1',
                                'text' => 'Character 1'
                            ],
                            'emotion' => [
                                'id' => 'emotion_1',
                                'text' => 'Anger'
                            ],
                            'dialogue' => [
                                'id' => 'dialogue_1',
                                'text' => 'I am angry.'
                            ],
                            'action' => [
                                'id' => 'action_1',
                                'text' => 'Punches the wall'
                            ]
                        ]
                    ],
                    'user' => 'testuser',
                ]
            ],
            'characters' => [
                [
                    'id' => 'char_1',
                    'name' => 'Character 1',
                    'role' => 'Protagonist',
                    'description' => 'Main character in the story',
                    'relationships' => [
                        [
                            'to' => 'char_2',
                            'type' => 'Friend',
                            'description' => 'Best friend'
                        ]
                    ],
                    'inScene' => ['scene1']
                ]
            ]
        ];

        $response = $this->post(route('scenes.store', ['scriptID' => $script->id]), $data);

        $response->assertStatus(302);
        $response->assertRedirect(url()->previous());

       return redirect()->back()->with('success', 'Scenes and Characters saved successfully!');


        $this->assertDatabaseHas('scenes', [
            'id' => 'scene1',
            'scriptID' => $script->id,
            'scene_num' => 1
        ]);

        $this->assertDatabaseHas('characters', [
            'id' => 'char_1',
            'name' => 'Character 1',
            'sceneID' => $script->id
        ]);
    }

    public function test_store_empty_data()
    {
        $script = Script::create(['id' => 'script_test_2', 'title' => 'Empty Script']);

        $response = $this->post(route('scenes.store', ['scriptID' => $script->id]), [
            'scenes' => [],
            'characters' => []
        ]);

        $response->assertStatus(302);
        $response->assertRedirect(url()->previous());
       return redirect()->back()->with('success', 'Scenes and Characters saved successfully!');


        $this->assertDatabaseCount('scenes', 0);
        $this->assertDatabaseCount('characters', 0);
    }

    public function test_delete_and_resave_scenes_and_characters()
    {
        $script = Script::create(['id' => 'script_test_3', 'title' => 'Delete & Replace Script']);

        Scene::create(['id' => 'old_scene', 'scriptID' => $script->id, 'scene_num' => 1]);
        Character::create(['id' => 'old_char', 'name' => 'Old Character', 'sceneID' => $script->id]);

        $data = [
            'scenes' => [
                [
                    'id' => 'new_scene',
                    'scene_num' => 2,
                    'sceneHead' => ['id' => 'scene_head_2', 'text' => 'Scene Heading 2'],
                    'sceneDesc' => ['id' => 'scene_desc_2', 'text' => 'Scene description 2'],
                    'lines' => [],
                    'user' => 'another_user',
                ]
            ],
            'characters' => [
                [
                    'id' => 'char_2',
                    'name' => 'Character 2',
                    'role' => 'Antagonist',
                    'description' => 'Antagonist in the story',
                    'relationships' => [],
                    'inScene' => ['new_scene']
                ]
            ]
        ];

        $response = $this->post(route('scenes.store', ['scriptID' => $script->id]), $data);

        $response->assertStatus(302);
        $response->assertRedirect(url()->previous());
       return redirect()->back()->with('success', 'Scenes and Characters saved successfully!');


        $this->assertDatabaseMissing('scenes', ['id' => 'old_scene']);
        $this->assertDatabaseMissing('characters', ['id' => 'old_char']);

        $this->assertDatabaseHas('scenes', ['id' => 'new_scene']);
        $this->assertDatabaseHas('characters', ['id' => 'char_2']);
    }
}
