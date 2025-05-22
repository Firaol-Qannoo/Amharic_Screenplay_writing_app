<?php

namespace App\Http\Controllers;

use App\Models\ProductionScene;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductionScheduleController extends Controller
{
    public function index()
    {
        $productionScenes = ProductionScene::all();

        if ($productionScenes->isEmpty()) {
            return Inertia::render('ScenesPage', [
                'scenes' => [],
                'title' => 'No Script Loaded',
                'author' => ''
            ]);
        }

        $firstScene = $productionScenes->first();

        return Inertia::render('ScenesPage', [
            'scenes' => $productionScenes,
            'title' => $firstScene->script_title ?? 'Untitled Script',
            'author' => $firstScene->script_author ?? 'Unknown Author'
        ]);
    }

    public function showWithStaticData(Request $request)
    {
        $request->validate(['scenes' => 'required|array']);
        $scriptData = $request->all();
        $parsedScenes = [];

        foreach ($scriptData['scenes'] as $sceneData) {
            $jsonSceneId = $sceneData['id'] ?? null;
            if (!$jsonSceneId) continue;

            $existingScene = ProductionScene::where('json_id', $jsonSceneId)->first();

            $parsedScene = $this->parseScene($sceneData);
            $parsedScene['json_id'] = $jsonSceneId;

            if ($existingScene) {
                $parsedScene['shoot_location'] = $existingScene->shoot_location;
                $existingScene->update($parsedScene);
                $productionScene = $existingScene;
            } else {
                $productionScene = ProductionScene::create($parsedScene);
            }

            $parsedScenes[] = $productionScene;
        }

        return Inertia::render('ScenesPage', [
            'scenes' => $parsedScenes,
            'title' => $scriptData['meta']['title'] ?? 'Untitled Script',
            'author' => $scriptData['meta']['author']['name'] ?? 'Unknown'
        ]);
    }

    public function saveShootLocations(Request $request)
    {
        $locations = $request->validate([
            'scenes' => 'required|array',
            'scenes.*.id' => 'required|string',
            'scenes.*.shoot_location' => 'nullable|string'
        ]);

        foreach ($locations['scenes'] as $scene) {
            ProductionScene::where('json_id', $scene['id'])->update([
                'shoot_location' => $scene['shoot_location']
            ]);
        }

        return response()->json(['status' => 'saved']);
    }

    private function parseScene(array $scene): array
    {
        $sceneHeadText = $scene['sceneHead']['text'] ?? '';
        $locationData = $this->parseSceneHead($sceneHeadText);

        $description = $scene['sceneDesc']['text'] ?? '';

        $castNames = [];
        foreach ($scene['lines'] as $line) {
            if (!empty($line['character']['text'])) {
                $castNames[] = trim($line['character']['text']);
            }
        }

        $castNames = array_values(array_unique($castNames));

        return [
            'scene_num' => $locationData['scene_number'] ?? 0,
            'location_type' => $locationData['type'],
            'location' => trim($locationData['name']),
            'description' => $description,
            'time_of_day' => $locationData['time'],
            'cast_ids' => $castNames,
            'shoot_location' => '',
            'pages' => '1',
        ];
    }

    private function parseSceneHead(string $text): array
    {
        $sceneNumber = null;
        $text = trim($text);

        if (preg_match('/^(\d+)[\.\s]*[-–\s]*/u', $text, $match)) {
            $sceneNumber = (int)$match[1];
            $text = substr($text, strlen($match[0]));
        }

        $text = preg_replace('/\s+/', ' ', trim($text));

        if (preg_match('/^(INT|EXT|ውስጥ|ውጪ)\s*[-–]\s*(.+?)\s*[-–]\s*(DAY|NIGHT|ቀን|ንጋት|ማታ|ሌሊት)$/iu', $text, $matches)) {
            $typeMap = ['INT' => 'ውስጥ', 'EXT' => 'ውጪ'];
            $timeMap = ['DAY' => 'ማታ', 'NIGHT' => 'ንጋት'];

            $type = $matches[1];
            if (in_array(strtoupper($type), ['INT', 'EXT'])) {
                $type = $typeMap[$type] ?? $type;
            }

            return [
                'scene_number' => $sceneNumber,
                'type' => $type,
                'name' => trim($matches[2]),
                'time' => $timeMap[$matches[3]] ?? $matches[3]
            ];
        }

        $text = preg_replace('/[-–]/u', ' ', $text);
        $text = preg_replace('/\s+/', ' ', trim($text));
        $words = explode(' ', $text);

        $type = null;
        $time = null;
        $nameParts = [];

        foreach ($words as $word) {
            $lower = strtolower($word);

            if (!$type && in_array($lower, ['int', 'ext', 'ውስጥ', 'ውጪ'])) {
                $type = $lower === 'int' ? 'ውስጥ' : ($lower === 'ext' ? 'ውጪ' : $word);
            } elseif (!$time && in_array($lower, ['day', 'night', 'ማታ', 'ንጋት', 'ቀን', 'ሌሊት'])) {
                $time = $word;
            } else {
                $nameParts[] = $word;
            }
        }

        $name = implode(' ', $nameParts);

        $name = preg_replace('/^\s*(ውስጥ|ውጪ|int|ext)\s*/iu', '', $name);

        return [
            'scene_number' => $sceneNumber,
            'type' => $type ?: '??',
            'name' => $name ?: '??',
            'time' => $time ?: '??'
        ];
    }
}
