<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AIImageService
{
    protected $apiKey;
    protected $apiEndpoint;

    public function __construct()
    {
        $this->apiKey = config('services.stability.key');
        $this->apiEndpoint = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
        
        \Log::info('AIImageService initialized', [
            'apiKey' => $this->apiKey ? 'present' : 'missing',
            'endpoint' => $this->apiEndpoint
        ]);
    }

    public function generateImage(string $prompt, string $scriptID)
    {
        try {
            if (empty($this->apiKey)) {
                throw new \Exception('Stability AI API key is not configured');
            }

            \Log::info('Starting image generation with prompt:', ['prompt' => $prompt]);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->apiEndpoint, [
                'text_prompts' => [
                    [
                        'text' => $prompt,
                        'weight' => 1
                    ]
                ],
                'cfg_scale' => 7,
                'height' => 1024,
                'width' => 1024,
                'samples' => 1,
                'steps' => 30,
            ]);

            if ($response->successful()) {
                \Log::info('API response successful');
                $imageData = base64_decode($response->json()['artifacts'][0]['base64']);
                $directory = 'storyboard/' . $scriptID;
                $filename = $directory . '/' . Str::uuid() . '.png';
                
                // Ensure directory exists
                if (!Storage::disk('public')->exists($directory)) {
                    Storage::disk('public')->makeDirectory($directory);
                }
                
                // Save the image
                Storage::disk('public')->put($filename, $imageData);
                $url = Storage::url($filename);
                
                \Log::info('Image saved successfully:', ['url' => $url]);
                return $url;
            }

            \Log::error('API response failed:', ['response' => $response->body()]);
            throw new \Exception('Failed to generate image: ' . $response->body());
        } catch (\Exception $e) {
            \Log::error('AI Image Generation Error: ' . $e->getMessage());
            throw $e;
        }
    }
} 