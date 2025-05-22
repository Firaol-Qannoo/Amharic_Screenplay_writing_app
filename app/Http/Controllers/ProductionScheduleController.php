<?php

namespace App\Http\Controllers;

use App\Models\ProductionScene;
use Inertia\Inertia;
use Illuminate\Http\Request;

    class ProductionScheduleController extends Controller {
       
        public function index() {
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

    public function showWithStaticData(Request $request) {
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

    private function parseScene(array $scene): array {
        
        $maxSceneNum = ProductionScene::max('scene_num');
        $scene_num = $maxSceneNum + 1;

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
            'scene_num' => $scene_num,
            'location_type' => $locationData['type'],
            'location' => trim(preg_replace('/^[-–\s]+|[-–\s]+$/u', '', implode(' ', array_map('trim', array_slice(explode('.', $locationData['name']), 1))))),
            'description' => $description,
            'time_of_day' => $locationData['time'],
            'cast_ids' => $castNames,
            'shoot_location' => '',
            'pages' => '1',
        ];
    }

    private function parseSceneHead(string $text): array
    {
        $text = preg_replace('/^\s*\d+\.\s*[-–]\s*/u', '', trim($text));
        $text = preg_replace('/\s+/', ' ', $text);

        preg_match('/^(INT|EXT|ውስጥ|ውጪ)\s*[-–]\s*(.+?)\s*[-–]\s*(DAY|NIGHT|ቀን|ንጋት|ማታ|ሌሊት)$/iu', $text, $matches);

        if (count($matches) === 4) {
            $typeMap = ['INT' => 'ውስጥ', 'EXT' => 'ውጪ'];
            $timeMap = ['DAY' => 'ማታ', 'NIGHT' => 'ንጋት'];

            $type = $matches[1];
            if (in_array(strtoupper($type), ['INT', 'EXT'])) {
                $type = $typeMap[$type] ?? $type;
            }

            $time = $matches[3];
            if (in_array(strtoupper($time), ['DAY', 'NIGHT'])) {
                $time = $timeMap[$time] ?? $time;
            }

            return [
                'type' => $type,
                'name' => trim($matches[2]),
                'time' => $time
            ];
        }
        $originalText = $text;

        if (str_contains(mb_strtolower($text), 'ውጪ')) {
            $type = 'ውጪ';
            $text = str_ireplace('ውጪ', '', $text);
        } elseif (str_contains(mb_strtolower($text), 'ውስጥ')) {
            $type = 'ውስጥ';
            $text = str_ireplace('ውስጥ', '', $text);
        } elseif (preg_match('/\bext\b/i', $text)) {
            $type = 'ውጪ';
            $text = preg_replace('/ext\s*[-–]?\s*/i', '', $text);
        } elseif (preg_match('/\bint\b/i', $text)) {
            $type = 'ውስጥ';
            $text = preg_replace('/int\s*[-–]?\s*/i', '', $text);
        } else {
            $type = '';
        }

        if (str_contains(mb_strtolower($text), 'ማታ') || str_contains(mb_strtolower($text), 'ቀን')) {
            $time = 'ማታ';
            $text = str_ireplace(['ማታ', 'ቀን'], '', $text);
        } elseif (str_contains(mb_strtolower($text), 'ንጋት') || str_contains(mb_strtolower($text), 'ሌሊት')) {
            $time = 'ንጋት';
            $text = str_ireplace(['ንጋት', 'ሌሊት'], '', $text);
        } elseif (preg_match('/night/i', $text)) {
            $time = 'ንጋት';
            $text = preg_replace('/night\s*[-–]?\s*$/i', '', $text);
        } elseif (preg_match('/day/i', $text)) {
            $time = 'ማታ';
            $text = preg_replace('/day\s*[-–]?\s*$/i', '', $text);
        } else {
            $time = '';
        }

        $text = preg_replace('/[-–]/', '', $text);
        $text = trim(preg_replace('/\s+/', ' ', $text));

        return [
            'type' => $type ?: '??',
            'name' => $text ?: '??',
            'time' => $time ?: '??'
        ];
    }

    private function getScriptJson(): array
    {
        return json_decode(<<<JSON
{
    "meta": {
        "title": "የአማርኛ የተወሰነ የታሪክ ድራማ",
        "author": {
            "name": "ዮሴፍ አርበኛ"
        }
    },
    "scenes": [
        {
            "id": "cw6IuRI99LcW9LLRXmWbh",
            "sceneHead": {
                "text": "ውጪ - ጊቢ ውስጥ - ማታ"
            },
            "sceneDesc": {
                "text": "ጊቢ ውስጥ ብዙ ሰው ተሰብስቡዋል"
            },
            "lines": [
                {
                    "character": { "text": "ስፖርተኛ" },
                    "dialogue": { "text": "ይቅርታ!!ሻምበል ይነበብ በላይ እርሶ ኖት" }
                },
                {
                    "character": { "text": "ሻምበል" },
                    "dialogue": { "text": "አዎ ነኝ!! ምንድነው!!" }
                }
            ]
        }
    ]
}
JSON, true);
    }
}
