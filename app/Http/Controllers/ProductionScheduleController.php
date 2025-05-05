<?php

namespace App\Http\Controllers;

use App\Models\ProductionScene;
use Inertia\Inertia;
use App\Models\Script;
use Illuminate\Http\Request;

class ProductionScheduleController extends Controller
{
    // app/Http/Controllers/ProductionScheduleController.php

    public function index()
    {
        // Use the built-in static JSON data
        $scriptData = $this->getScriptJson();

        // Parse scenes
        $parsedScenes = [];

        foreach ($scriptData['scenes'] as $sceneData) {
            $jsonSceneId = $sceneData['id'] ?? null;

            if (!$jsonSceneId) continue;

            // Check if scene exists in DB
            $existingScene = ProductionScene::where('json_id', $jsonSceneId)->first();

            $parsedScene = $this->parseScene($sceneData);
            $parsedScene['json_id'] = $jsonSceneId;

            if ($existingScene) {
                // Optionally update the existing scene
                $existingScene->update($parsedScene);
                $productionScene = $existingScene;
            } else {
                $productionScene = ProductionScene::create($parsedScene);
            }

            $parsedScenes[] = $productionScene;
        }

        return Inertia::render('ScenesPage', [
                'scenes' => $parsedScenes,
                'title' => $scriptData['meta']['title'] ?? 'Untitled',
                'author' => $scriptData['meta']['author']['name'] ?? 'Unknown'
            ]);
    }
    //use Inertia\Inertia;

    public function showWithStaticData(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'scenes' => 'required|array',
        ]);

        $scriptData = $request->all(); // This contains the full script object sent from React
        $parsedScenes = [];

        foreach ($scriptData['scenes'] as $sceneData) {
            $jsonSceneId = $sceneData['id'] ?? null;
            if (!$jsonSceneId) continue;

            // Check if scene exists in DB
            $existingScene = ProductionScene::where('json_id', $jsonSceneId)->first();

            // Parse scene data
            $parsedScene = $this->parseScene($sceneData);
            $parsedScene['json_id'] = $jsonSceneId;

            if ($existingScene) {
                // Optionally update existing scene
                $existingScene->update($parsedScene);
                $productionScene = $existingScene;
            } else {
                // Create new scene
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

    /**
     * Get script data from database model
     */
    private function getScriptDataFromModel(Script $script): array
    {
        // Assuming your Script model has a 'scenes' JSON column
        return [
            'meta' => [
                'title' => $script->title,
                'author' => [
                    'name' => $script->author_name,
                    'username' => $script->author_username,
                ],
            ],
            'scenes' => json_decode($script->scenes, true) // Convert JSON string to array
        ];
    }

    /**
     * Parses a single scene from Ethiopian-style JSON format
     */
    private function parseScene(array $scene): array
    {
        static $sceneNumCounter = 1;
        $scene_num = $sceneNumCounter++;

        $sceneHeadText = $scene['sceneHead']['text'] ?? '';
        $locationData = $this->parseSceneHead($sceneHeadText);

        // 🔥 Extract unique character names from lines
        $castNames = [];

        foreach ($scene['lines'] as $line) {
            if (!empty($line['character']['text'])) {
                $castNames[] = trim($line['character']['text']);
            }
        }

        // Remove duplicates
        $castNames = array_values(array_unique($castNames));

        return [
            'scene_num' => $scene_num,
            'location_type' => strtoupper($locationData['type']),
            'location' => $locationData['name'],
            'description' => $scene['sceneDesc']['text'] ?? '',
            'time_of_day' => strtoupper($locationData['time']),
            'cast_ids' => $castNames, // Now we are storing actual names like "ስፖርተኛ"
            'shoot_location' => '', // Will be filled later
            'pages' => '1',         // Placeholder
        ];
    }

    /**
     * Helper: Parses location and time from scene heading
     */
    private function parseSceneHead(string $text): array
    {
        // Normalize spacing
        $text = preg_replace('/\s+/', ' ', trim($text));

        // Match pattern like: ውጪ - LOCATION - ንጋት
        preg_match('/^(INT|EXT|ውስጥ|ውጪ)\s*[-–]\s*(.+?)\s*[-–]\s*(DAY|NIGHT|ቀን|ንጋት)$/iu', $text, $matches);

        if (count($matches) === 4) {
            $typeMap = ['ውስጥ' => 'INT', 'ውጪ' => 'EXT'];
            $timeMap = ['ቀን' => 'DAY', 'ንጋት' => 'NIGHT'];

            $type = strtoupper($matches[1]);
            if (array_key_exists($matches[1], $typeMap)) {
                $type = $typeMap[$matches[1]];
            }

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

        // Fallback: Try to guess type and time from text
        $type = '';
        $time = '';
        $name = $text;

        // Detect type
        if (str_contains(mb_strtolower($text), 'ውጪ') || str_contains(mb_strtolower($text), 'ext')) {
            $type = 'EXT';
            $name = str_replace(['ውጪ', 'EXT'], '', $name);
        } elseif (str_contains(mb_strtolower($text), 'ውስጥ') || str_contains(mb_strtolower($text), 'int')) {
            $type = 'INT';
            $name = str_replace(['ውስጥ', 'INT'], '', $name);
        }

        // Detect time
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

    /**
     * Simulate fetching Ethiopian script JSON
     */
    private function getScriptJson(): array
    {
        return json_decode(<<<JSON
{
    "meta": {
        "id": "cw6IuRI99LcW9LLRXmWbh",
        "title": "የአማርኛ የተወሰነ የታሪክ ድራማ",
        "author": {
            "name": "ዮሴፍ አርበኛ",
            "username": "yosef2m"
        },
        "genre": "የታሪክ ድራማ",
        "createdAt": "2023-10-01",
        "updatedAt": "2023-10-01",
        "contributors": [
            {
                "name": "ዮሴፍ አርበኛ",
                "role": "ዋነኛ የጽሁፍ ባለሙያ",
                "username": "yosef2m"
            }
        ]
    },
    "scenes": [
        {
            "id": "cw6IuRI99LcW9LLRXmWbh",
            "sceneHead": {
                "id": "J-hqyvURXdIxF-aKdDFVH",
                "text": "ውጪ-አውቶቢስ ተራ መስቀለኛ ዋናው መንገድ-ንጋት"
            },
            "sceneDesc": {
                "id": "HgeDzGtHBl8GvvA9mdazM",
                "text": "ከጎጃም በረንዳ አውቶብስ ተራ፣ ከመሳለሚያ አውቶቢስ ተራ፣ ከሚካኤል አውቶቢስ ተራ፣ ከሰባተኛ አውቶቢስ ተራ የሚያመሩት..."
            },
            "lines": [
                {
                    "lineId": "hqyyWjFewnU13l2F7Ka2k",
                    "character": {
                        "id": "JGPRY-sSnRS6Q8FPCuR6y",
                        "text": "ስፖርተኛ"
                    },
                    "dialogue": {
                        "id": "ZE46WB2HghEAAX4zcBFyY",
                        "text": "ይቅርታ!!ሻምበል ይነበብ በላይ እርሶ ኖት"
                    }
                },
                {
                    "lineId": "vagD1w91TODFk4_m63YE-",
                    "character": {
                        "id": "Oe_EdQQDBO_3XTyMFG2wl",
                        "text": "ሻምበል"
                    },
                    "emotion": {
                        "id": "n2uhSr7AlH8_DC7ajyeDF",
                        "text": "በንቀት እና በቁጣ"
                    },
                    "dialogue": {
                        "id": "knnwa7JpIIm61KOOymz8J",
                        "text": "አዎ ነኝ!! ምንድነው!!"
                    }
                }
            ]
        },
        {
            "id": "pz-9yEziHKoVDTnf-8Ms6",
            "sceneHead": {
                "id": "WLOvGNEevQBYauT-6odGz",
                "text": "ውጪ -የመንደር ስፖርት ሜዳ -ንጋት"
            },
            "sceneDesc": {
                "id": "r4_pToqf0mJw33in2fwno",
                "text": "በአየር ላይ የምናያት ኳስ በቀስታ እንቅስቃሴ አየር ላይ ለፋታ ካየናት በኋላ እውነተኛ ሰአት ተወርውራ መሬት ስታርፍ በርካታ ሰዎች..."
            },
            "lines": [
                {
                    "lineId": "8d6-XPRIK2P4odZNx3kWC",
                    "character": {
                        "id": "-7Ykjon_mlFncqfxP7YPi",
                        "text": "አዱኛ"
                    },
                    "dialogue": {
                        "id": "UxjXmwgjOi-ztpDe0dJQZ",
                        "text": "ኳስ በመሬት እናንት ሰዎች …/ለራሱ / ዘንድሮ መሬት የያዘ፣መውደቂያውን ያሳምራል! ..."
                    }
                },
                {
                    "lineId": "jVckvAd_ewQZdZta1sT_p",
                    "action": {
                        "id": "usfphAF1Uk84Ij6to8ggq",
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
