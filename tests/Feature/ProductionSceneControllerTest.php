<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\ProductionScene;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;
use Illuminate\Support\Facades\Schema;
use App\Http\Controllers\ProductionScheduleController;

class ProductionSceneControllerTest extends TestCase
{
    /** @test */
    public function it_parses_and_saves_scenes_from_json_and_renders_inertia_view()
    {

        $scriptJson = [
            'meta' => [
                'title' => 'Test Script',
                'author' => ['name' => 'Jane Doe'],
            ],
            'scenes' => [
                [
                    'id' => 'scene-1',
                    'content' => 'First Scene'
                ],
                [
                    'id' => 'scene-2',
                    'content' => 'Second Scene'
                ]
            ]
        ];

        $controller = $this->getMockBuilder(ProductionScheduleController::class)
            ->onlyMethods(['getScriptJson', 'parseScene'])
            ->getMock();

        $controller->method('getScriptJson')->willReturn($scriptJson);

        $controller->method('parseScene')->willReturnCallback(function ($scene) {
            return [
                'content' => $scene['content'],
                'extra_field' => 'value'
            ];
        });

        $this->app->instance(ProductionScheduleController::class, $controller);

        $response = $this->get('/your-route-for-scenes'); 

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) =>
            $page->component('ScenesPage')
                ->where('title', 'Test Script')
                ->where('author', 'Jane Doe')
                ->has('scenes', 2)
                ->where('scenes.0.json_id', 'scene-1')
                ->where('scenes.0.content', 'First Scene')
        );

        $this->assertDatabaseHas('production_scenes', [
            'json_id' => 'scene-1',
            'content' => 'First Scene',
        ]);

        $this->assertDatabaseHas('production_scenes', [
            'json_id' => 'scene-2',
            'content' => 'Second Scene',
        ]);
    }
}
