<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Scene;

class SceneControllerTest extends TestCase
{

    protected function setUp(): void {
        parent::setUp();
        // Clean MongoDB 'scenes' collection if needed manually
        Scene::truncate();
    }

    public function test_user_can_create_scene()
    {
        $data = [
            'scriptID' => 'script001',
            'scene_num' => 1,
            'location' => 'INT. KITCHEN',
            'time_of_day' => 'DAY',
            'time' => now()->toISOString(),
           'blocks' => [
    [
        'type' => 'scene_heading',
        'text' => 'INT. OFFICE - NIGHT',
        'style' => [
            'font' => 'Courier',
            'size' => 12,
            'uppercase' => true,
        ],
        'position' => ['top' => 0, 'left' => 0]
    ],
    [
        'type' => 'action',
        'text' => 'A dim light flickers above. Papers scattered on the desk.',
        'style' => [
            'font' => 'Courier',
            'size' => 12
        ],
        'position' => ['top' => 1, 'left' => 0]
    ],
    [
        'type' => 'character',
        'text' => 'DETECTIVE HARRIS',
        'style' => [
            'uppercase' => true,
            'align' => 'center'
        ],
        'position' => ['top' => 2, 'left' => 150]
    ],
    [
        'type' => 'parenthetical',
        'text' => '(muttering to himself)',
        'style' => [
            'italic' => true
        ],
        'position' => ['top' => 3, 'left' => 120]
    ],
    [
        'type' => 'dialog',
        'text' => 'Something doesn’t add up...',
        'style' => [
            'font' => 'Courier',
            'size' => 12
        ],
        'position' => ['top' => 4, 'left' => 150]
    ],
    [
        'type' => 'shot',
        'text' => 'CLOSE UP - DETECTIVE’S EYES',
        'style' => [
            'uppercase' => true,
            'bold' => true
        ],
        'position' => ['top' => 5, 'left' => 0]
    ],
    [
        'type' => 'transition',
        'text' => 'CUT TO:',
        'style' => [
            'align' => 'right',
            'uppercase' => true
        ],
        'position' => ['top' => 6, 'left' => 400]
    ]
]

        ];

        $response = $this->postJson('/scenes', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['scriptID' => 'script001']);

        $this->assertDatabaseHas('scenes', ['scriptID' => 'script001']);
    }

    public function test_scene_creation_fails_with_missing_fields()
    {
        $data = [
            'scene_num' => 1,
            // Missing scriptID, blocks, etc.
        ];

        $response = $this->postJson('/scenes', $data);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['scriptID', 'blocks']);
    }

    public function test_user_can_fetch_single_scene()
    {
        $scene = Scene::create([
            'scriptID' => 'script002',
            'scene_num' => 2,
            'location' => 'INT. LAB',
            'time_of_day' => 'NIGHT',
            'time' => now(),
            'blocks' => [
    [
        'type' => 'scene_heading',
        'text' => 'INT. OFFICE - NIGHT',
        'style' => [
            'font' => 'Courier',
            'size' => 12,
            'uppercase' => true,
        ],
        'position' => ['top' => 0, 'left' => 0]
    ],
    [
        'type' => 'action',
        'text' => 'A dim light flickers above. Papers scattered on the desk.',
        'style' => [
            'font' => 'Courier',
            'size' => 12
        ],
        'position' => ['top' => 1, 'left' => 0]
    ],
    [
        'type' => 'character',
        'text' => 'DETECTIVE HARRIS',
        'style' => [
            'uppercase' => true,
            'align' => 'center'
        ],
        'position' => ['top' => 2, 'left' => 150]
    ],
    [
        'type' => 'parenthetical',
        'text' => '(muttering to himself)',
        'style' => [
            'italic' => true
        ],
        'position' => ['top' => 3, 'left' => 120]
    ],
    [
        'type' => 'dialog',
        'text' => 'Something doesn’t add up...',
        'style' => [
            'font' => 'Courier',
            'size' => 12
        ],
        'position' => ['top' => 4, 'left' => 150]
    ],
    [
        'type' => 'shot',
        'text' => 'CLOSE UP - DETECTIVE’S EYES',
        'style' => [
            'uppercase' => true,
            'bold' => true
        ],
        'position' => ['top' => 5, 'left' => 0]
    ],
    [
        'type' => 'transition',
        'text' => 'CUT TO:',
        'style' => [
            'align' => 'right',
            'uppercase' => true
        ],
        'position' => ['top' => 6, 'left' => 400]
    ]
]

        ]);

        $response = $this->getJson("/scenes/{$scene->_id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['scene_num' => 2])
                 ->assertJsonFragment(['location' => 'INT. LAB']);
    }
}
