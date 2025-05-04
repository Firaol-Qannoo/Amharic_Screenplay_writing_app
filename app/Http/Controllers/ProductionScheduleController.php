<?php

namespace App\Http\Controllers;

use App\Models\ProductionScene;
use Inertia\Inertia;

class ProductionScheduleController extends Controller
{
    public function index()
    {
        $jsonData = $this->getNewScriptJson();

        $parsedScenes = [];

        foreach ($jsonData['scenes'] as $sceneData) {
            $jsonSceneId = $sceneData['id'] ?? null;

            if (!$jsonSceneId) {
                continue;
            }

            $existingScene = ProductionScene::where('json_id', $jsonSceneId)->first();

            $parsedScene = $this->parseNewSceneFormat($sceneData);

            $parsedScene['json_id'] = $jsonSceneId;

            if ($existingScene) {
                $productionScene = $existingScene;
            } else {
                $productionScene = ProductionScene::create($parsedScene);
            }

            $parsedScenes[] = $productionScene;
        }

        return Inertia::render('ScenesPage', [
            'scenes' => $parsedScenes
        ]);
    }

    private function parseNewSceneFormat(array $scene): array
    {
        static $sceneNumCounter = 1;
        $scene_num = $sceneNumCounter++;

        $sceneHeadText = $scene['sceneHead']['text'] ?? '';
        $parsedLocation = $this->parseSceneHead($sceneHeadText);

        $description = $scene['sceneDesc']['text'] ?? '';

        $castIds = [];
        foreach ($scene['lines'] ?? [] as $line) {
            if (!empty($line['character']['text'])) {
                $castIds[] = trim($line['character']['text']);
            }
        }

        $castIds = array_unique($castIds);

        return [
            'scene_num' => $scene_num,
            'location_type' => strtoupper($parsedLocation['type'] ?? ''),
            'location' => $parsedLocation['name'] ?? '',
            'description' => $description,
            'time_of_day' => strtoupper($parsedLocation['time'] ?? ''),
            'cast_ids' => $castIds,
            'shoot_location' => '',
            'pages' => '1',
        ];
    }

    private function parseSceneHead(string $text): array
    {
        $text = preg_replace('/\s+/', ' ', trim($text));

        preg_match('/^(INT|EXT|ውስጥ|ውጪ)\s*-\s*(.+?)\s*-\s*(DAY|NIGHT|ቀን|ንጋት)$/iu', $text, $matches);

        if (count($matches) === 4) {
            $typeMap = [
                'ውስጥ' => 'INT',
                'ውጪ' => 'EXT',
            ];

            $type = strtoupper($matches[1]);
            if (array_key_exists($matches[1], $typeMap)) {
                $type = $typeMap[$matches[1]];
            }

            $timeMap = [
                'ቀን' => 'DAY',
                'ንጋት' => 'NIGHT',
            ];
            $time = strtoupper($matches[3]);
            if (array_key_exists($matches[3], $timeMap)) {
                $time = $timeMap[$matches[3]];
            }

            return [
                'type' => $type,
                'name' => trim($matches[2]),
                'time' => $time
            ];
        }

        $type = '';
        $time = '';
        $name = $text;

        if (str_contains(mb_strtolower($text), 'ውጪ') || str_contains(mb_strtolower($text), 'ext')) {
            $type = 'EXT';
            $name = str_replace(['ውጪ', 'EXT'], '', $name);
        } elseif (str_contains(mb_strtolower($text), 'ውስጥ') || str_contains(mb_strtolower($text), 'int')) {
            $type = 'INT';
            $name = str_replace(['ውስጥ', 'INT'], '', $name);
        }

        if (str_contains(mb_strtolower($text), 'ቀን') || str_contains(mb_strtolower($text), 'day')) {
            $time = 'DAY';
            $name = str_replace(['ቀን', 'DAY'], '', $name);
        } elseif (str_contains(mb_strtolower($text), 'ንጋት') || str_contains(mb_strtolower($text), 'night')) {
            $time = 'NIGHT';
            $name = str_replace(['ንጋት', 'NIGHT'], '', $name);
        }

        return [
            'type' => $type,
            'name' => trim($name),
            'time' => $time
        ];
    }

    private function getNewScriptJson(): array
    {
        return json_decode(<<<JSON
{
    "scenes": [
        {
            "id": "ghQi_UREjqIRQP65VpVz0",
            "sceneHead": {
                "id": "OzvQihiZiYw1iUvHGPmgk",
                "text": "ውጪ - አውቶቢስ ተራ መስቀለኛ ዋናው መንገድ - ንጋት"
            },
            "sceneDesc": {
                "id": "B_24bDwfk9CYhlauNG8p9",
                "text": "ከጎጃም በረንዳ አውቶብስ ተራ፣ ከመሳለሚያ አውቶቢስ ተራ፣ ከሚካኤል አውቶቢስ ተራ፣ ከሰባተኛ አውቶቢስ ተራ የሚያመሩት..."
            },
            "lines": [
                {
                    "lineId": "PPxxb3XIceKhbCjlAwacE",
                    "character": {
                        "id": "mPoHdE9Cio3I7G6-tINzM",
                        "text": "ስፖርተኛ"
                    },
                    "dialogue": {
                        "id": "nKQZ8wJz1MB5wkI7LrSpe",
                        "text": "ይቅርታ!!ሻምበል ይነበብ በላይ እርሶ ኖት"
                    }
                },
                {
                    "lineId": "fGxMRUK0gi9zAot1cn4x4",
                    "character": {
                        "id": "V4IVqJNj19dDDR5GlE3we",
                        "text": "ሻምበል"
                    },
                    "emotion": {
                        "id": "XyxjR_AHSXB3ggXSafMZ6",
                        "text": "በንቀት እና በቁጣ"
                    },
                    "dialogue": {
                        "id": "6wozrStpY7TiFmK8B81cc",
                        "text": "አዎ ነኝ!! ምንድነው!!"
                    }
                }
            ]
        },
        {
            "id": "M4d8xfMO2BECGVWu1dQvc",
            "sceneHead": {
                "id": "ej512IG9OpN80qSvIXUz3",
                "text": "ውስጥ -የመንደር ስፖርት ሜዳ -ቀን"
            },
            "sceneDesc": {
                "id": "v5yFF71iWoXY3btdz4a11",
                "text": null
            },
            "lines": [
                {
                    "lineId": "M3R69pwKo76hjxE1QI9FL",
                    "character": {
                        "id": "RsXA__9IPqKQ-gK-szImV",
                        "text": "ቤቢ"
                    },
                    "dialogue": {
                        "id": "tNA659UM1euIQbYNONsUe",
                        "text": "ኳስ በመሬት እናንት ሰዎች …/ለራሱ / ዘንድሮ መሬት የያዘ፣መውደቂያውን ያሳምራል! ..."
                    }
                },
                {
                    "lineId": "8gZpkXtqCjbnt_U-_FnxX",
                    "action": {
                        "id": "ebnashcOuV75WhoaaS1vd",
                        "text": "ጆኒ የተባለው ጆሊው ተጫዋች ኳሷን እያሽሞነሞነ ቄንጥ ይሰራባታል"
                    }
                }
            ]
        }
    ]
}
JSON, true);
    }
}
