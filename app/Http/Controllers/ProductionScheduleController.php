<?php

namespace App\Http\Controllers;

use App\Models\ProductionScene;
use Inertia\Inertia;

class ProductionScheduleController extends Controller
{
    public function index()
    {
        $dataArray = $this->getExampleScriptData();

        $parsedScenes = [];
        foreach ($dataArray as $data) {
            $parsedScene = $this->parseSceneData($data);

            $productionScene = ProductionScene::create($parsedScene);
            $parsedScenes[] = $productionScene;
        }

        return Inertia::render('ScenesPage', [
            'scenes' => $parsedScenes
        ]);
    }

    private function parseSceneData(array $data): array
    {
        $sceneNum = $data['scene_num'] ?? null;
        $rawLocation = $data['location'] ?? '';
        $timeOfDay = strtoupper($data['time_of_day'] ?? '');

        preg_match('/^(INT|EXT)\.\s*(.*)$/i', $rawLocation, $matches);
        $locationType = $matches[1] ?? '';
        $locationName = $matches[2] ?? $rawLocation;

        $description = '';
        foreach ($data['blocks'] ?? [] as $block) {
            if ($block['type'] === 'action') {
                $description = $block['text'];
                break;
            }
        }

        $castIds = [];
        foreach ($data['blocks'] ?? [] as $block) {
            if ($block['type'] === 'character') {
                $castIds[] = trim($block['text']);
            }
        }

        $castIds = array_unique($castIds);

        return [
            'scene_num' => $sceneNum,
            'location_type' => strtoupper($locationType),
            'location' => $locationName,
            'description' => $description,
            'time_of_day' => $timeOfDay,
            'cast_ids' => $castIds,
            'shoot_location' => '',
            'pages' => '1',
        ];
    }

    private function getExampleScriptData(): array
    {
        return [
            [
                'scriptID' => 'script001',
                'scene_num' => 1,
                'location' => 'INT. KITCHEN',
                'time_of_day' => 'DAY',
                'blocks' => [
                    ['type' => 'scene_heading', 'text' => 'INT. KITCHEN - DAY'],
                    ['type' => 'action', 'text' => 'A dim light flickers above...'],
                    ['type' => 'character', 'text' => 'DETECTIVE HARRIS'],
                    ['type' => 'dialog', 'text' => 'Something doesn’t add up...'],
                ],
            ],
            [
                'scriptID' => 'script001',
                'scene_num' => 2,
                'location' => 'EXT. PARK - NIGHT',
                'time_of_day' => 'NIGHT',
                'blocks' => [
                    ['type' => 'scene_heading', 'text' => 'EXT. PARK - NIGHT'],
                    ['type' => 'action', 'text' => 'Wind howls through empty swings...'],
                    ['type' => 'character', 'text' => 'JONNY'],
                    ['type' => 'dialog', 'text' => 'Did you hear that?'],
                ],
            ]
        ];
    }
}
