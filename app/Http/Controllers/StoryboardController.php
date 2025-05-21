<?php

namespace App\Http\Controllers;

use App\Models\Scene;
use App\Models\StoryboardFrame;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class StoryboardController extends Controller
{

    public function index($scriptId)
    {
        $scenes = Scene::where('scriptID', $scriptId)->get();

        if ($scenes->isEmpty()) {
            return Inertia::render('StoryboardPage', [
                'scriptId' => $scriptId,
                'frames' => []
            ]);
        }

        $frames = [];

        foreach ($scenes as $scene) {
            $frame = StoryboardFrame::where('script_id', $scriptId)
                ->where('scene_json_id', $scene->id)
                ->first();

            // Parse scene heading
            $sceneHeadText = $scene->sceneHead['text'] ?? '';
            $locationData = $this->parseSceneHead($sceneHeadText);
            $heading = trim("{$locationData['type']} – {$locationData['name']} – {$locationData['time']}");

            $frames[] = $frame
                ? array_merge($frame->toArray(), [
                    'description' => $scene->sceneDesc['text'] ?? '',
                    'heading' => $heading,
                    'scene_json_id' => $scene->id
                ])
                : [
                    'description' => $scene->sceneDesc['text'] ?? '',
                    'heading' => $heading,
                    'scene_json_id' => $scene->id,
                    'image_data' => null,
                    'notes' => '',
                ];
        }

        return Inertia::render('StoryboardPage', [
            'scriptId' => $scriptId,
            'frames' => $frames
        ]);
    }

    function parseSceneHead(string $text): array
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


    public function save(Request $request)
    {
        $request->validate([
            'script_id' => 'required|string',
            'frames' => 'required|array',
            'frames.*.scene_json_id' => 'required|string',
            'frames.*.image_data' => 'nullable|string',
            'frames.*.notes' => 'nullable|string'
        ]);

        $scriptId = $request->input('script_id');
        $frames = $request->input('frames');

        foreach ($frames as $frame) {
            StoryboardFrame::updateOrCreate(
                [
                    'script_id' => $scriptId,
                    'scene_json_id' => $frame['scene_json_id']
                ],
                [
                    'image_data' => $frame['image_data'] ?? null,
                    'notes' => $frame['notes'] ?? ''
                ]
            );
        }

        return response()->json(['status' => 'saved']);
    }
}
