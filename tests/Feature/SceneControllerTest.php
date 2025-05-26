<?php

namespace Tests\Feature;

use App\Models\Script;
use App\Models\Scene;
use App\Models\Character;
use Tests\TestCase;

class SceneControllerTest extends TestCase
{

    public function test_store_scenes_and_characters_successfully()
    {
        $script = Script::factory()->create();

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
                ],
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

        $response = $this->postJson(route('scenes', ['scriptID' => $script->id]), $data);

        $response->assertStatus(302); // redirect status

        $this->assertDatabaseHas('scenes', [
            'scriptID' => $script->id,
            'id' => 'scene1',
            'scene_num' => 1
        ]);

        $this->assertDatabaseHas('characters', [
            'sceneID' => $script->id,
            'id' => 'char_1',
            'name' => 'Character 1'
        ]);

        $response->assertRedirect(url()->previous());

        // Assert flash success message (assuming localization key 'messages.scenes_saved')
        $response->assertSessionHas('flash_notification.0.message', __('messages.scenes_saved'));
    }

    public function test_store_empty_data()
    {
        $script = Script::factory()->create();

        $response = $this->postJson(route('scenes', ['scriptID' => $script->id]), [
            'scenes' => [],
            'characters' => []
        ]);

        $response->assertStatus(302);

        $this->assertDatabaseCount('scenes', 0);
        $this->assertDatabaseCount('characters', 0);

        $response->assertRedirect(url()->previous());
    }

    public function test_delete_and_resave_scenes_and_characters()
    {
        $script = Script::factory()->create();
        $scene = Scene::factory()->create(['scriptID' => $script->id]);
        $character = Character::factory()->create(['sceneID' => $script->id]);

        $data = [
            'scenes' => [
                [
                    'id' => 'scene2',
                    'scene_num' => 2,
                    'sceneHead' => ['id' => 'scene_head_2', 'text' => 'Scene Heading 2'],
                    'sceneDesc' => ['id' => 'scene_desc_2', 'text' => 'Scene description 2'],
                    'lines' => []
                ]
            ],
            'characters' => [
                [
                    'id' => 'char_2',
                    'name' => 'Character 2',
                    'role' => 'Antagonist',
                    'description' => 'Antagonist in the story',
                    'relationships' => [],
                    'inScene' => ['scene2']
                ]
            ]
        ];

        $response = $this->postJson(route('scenes', ['scriptID' => $script->id]), $data);

        $response->assertStatus(302);

        // Old scene & character should be deleted
        $this->assertDatabaseMissing('scenes', ['scriptID' => $script->id, 'id' => $scene->id]);
        $this->assertDatabaseMissing('characters', ['sceneID' => $script->id, 'id' => $character->id]);

        // New scene & character inserted
        $this->assertDatabaseHas('scenes', ['scriptID' => $script->id, 'id' => 'scene2']);
        $this->assertDatabaseHas('characters', ['sceneID' => $script->id, 'id' => 'char_2']);

        $response->assertRedirect(url()->previous());
    }
}
