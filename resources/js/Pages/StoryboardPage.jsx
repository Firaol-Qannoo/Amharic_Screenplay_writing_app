import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function StoryboardPage({ scriptId, frames }) {
    const { t } = useTranslation();
    const [localFrames, setLocalFrames] = useState(frames || []);
    const [brushColor, setBrushColor] = useState('#000000');
const [brushSize, setBrushSize] = useState(5);
const [isErasing, setIsErasing] = useState(false);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [generatedImageStatus, setGeneratedImageStatus] = useState(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [polling, setPolling] = useState(false);

    const selectedScene = localFrames[currentSceneIndex];


    useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas || !selectedScene) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (selectedScene.image_data) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = selectedScene.image_data;
        }
    }, [selectedScene]);

    const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = e.target;
    const ctx = canvas.getContext('2d');
    const pos = getCanvasPos(canvas, e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
};

const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = e.target;
    const ctx = canvas.getContext('2d');
    const pos = getCanvasPos(canvas, e);

    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isErasing ? '#FFFFFF' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
};

    const handleMouseUpOrLeave = (e) => {
        setIsDrawing(false);
        const canvas = e.target;
        const imageData = canvas.toDataURL(); 
        updateLocalFrame(selectedScene.scene_json_id, 'image_data', imageData);
    };

    const getCanvasPos = (canvas, e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const updateLocalFrame = (sceneId, field, value) => {
        const updated = localFrames.map(f =>
            f.scene_json_id === sceneId ? { ...f, [field]: value } : f
        );
        setLocalFrames(updated);
    };

    const handleNotesChange = (value) => {
        updateLocalFrame(selectedScene.scene_json_id, 'notes', value);
    };

    const handleSaveSingle = async (frame) => {
        try {
            const response = await fetch('/storyboard/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    script_id: scriptId,
                    frames: [frame]
                })
            });

            if (!response.ok) throw new Error(t('storyboard.error_save'));
            alert("Saved!");
        } catch (error) {
           console.error(t('storyboard.error_saving_frame'), error);
        }
    };

    const clearCanvas = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateLocalFrame(selectedScene.scene_json_id, 'image_data', null);
};

    const handleSaveAll = async () => {
        try {
            const response = await fetch('/storyboard/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    script_id: scriptId,
                    frames: localFrames
                })
            });

            if (!response.ok) throw new Error("Save failed");
            alert(t('storyboard.all_saved'));
        } catch (error) {
            console.error("Error saving storyboard:", error);
             alert(t('storyboard.error_saving_all'));
        }
    };


const generateAIReference = async () => {
    if (!selectedScene?.description) {
       alert(t('storyboard.no_scene_description'));
        return;
    }

    setGenerating(true);
    setGeneratedImageStatus("IN_QUEUE");

    try {
        const response = await fetch('http://localhost:4800/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                scene: selectedScene.description,
                extra: "cinematic style, dramatic lighting"
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to generate image (status ${response.status}): ${text.substring(0, 100)}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error("Invalid JSON returned by FastAPI");
        }

        console.log("Received image URL:", data.image_url);

        if (data.image_url) {
            const imageUrl = data.image_url.trim();
            setGeneratedImageUrl(imageUrl);
            setGeneratedImageStatus("COMPLETED");
        } else {
            throw new Error("No image URL in API response");
        }
    } catch (error) {
        console.error("Error calling FastAPI:", error.message);
       alert(t('storyboard.ai_generation_failed'));
    } finally {
        setGenerating(false);
    }
};

    const selectScene = (index) => {
        setCurrentSceneIndex(index);
        setGeneratedImageStatus(null);
        setGeneratedImageUrl(null);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto flex gap-6">
            {/* Scene List Sidebar */}
            <div className="w-1/4 bg-white border rounded shadow-sm p-4 h-fit sticky top-6">
                <h2 className="font-semibold mb-4">{t('storyboard.scenes')}</h2>
                <ul className="space-y-2">
                    {localFrames.map((frame, index) => (
                        <li key={index}>
                            <button
                                onClick={() => selectScene(index)}
                                className={`block w-full text-left px-3 py-2 rounded ${
                                    index === currentSceneIndex
                                        ? 'bg-blue-100 text-blue-800 font-medium'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {frame.heading || `Scene ${frame.scene_json_id}`}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Canvas + Description */}
            <div className="flex-1 space-y-6">
                {/* Back Button */}
                    <button
        onClick={() => window.history.back()}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
    >
        {t('storyboard.back')}
    </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Canvas */}
<div className="lg:col-span-2 border rounded shadow-sm p-4 bg-white">
    <h3 className="font-medium mb-2">
        {t('storyboard.draw_for_scene')}: {selectedScene?.heading || 'Untitled'}
    </h3>

    {/* Canvas Tools */}
<div className="flex flex-wrap gap-4 mb-4">
    <div>
        <label className="block text-xs text-gray-600">{t('storyboard.brush_color')}</label>
        <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            disabled={isErasing}
            className="w-10 h-8 cursor-pointer"
        />
    </div>

    <div>
        <label className="block text-xs text-gray-600">{t('storyboard.brush_size')}: {brushSize}px</label>
        <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full"
        />
    </div>

    <div>
        <label className="block text-xs text-gray-600">{t('storyboard.tool')}</label>
        <button
            onClick={() => setIsErasing(!isErasing)}
            className={`px-3 py-1 rounded-md text-sm ${
                isErasing ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
        >
            {isErasing ? t('storyboard.eraser_on') : t('storyboard.brush')}

        </button>
    </div>

    <div>
        <label className="block text-xs text-gray-600">&nbsp;</label>
        <button
            onClick={clearCanvas}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
        >
           {t('storyboard.clear_canvas')}
        </button>
    </div>
</div>

    <canvas
        id="storyboard-canvas"
        width="600"
        height="400"
        className="border border-gray-300 rounded w-full h-auto bg-gray-50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
    />

    <textarea
        placeholder={t('storyboard.add_notes_placeholder')}
        value={selectedScene?.notes || ''}
        onChange={(e) => handleNotesChange(e.target.value)}
        className="mt-3 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
        onClick={() => handleSaveSingle(selectedScene)}
        className="mt-3 bg-black text-white px-4 py-1 rounded text-sm"
    >
         {t('storyboard.save_frame')}
    </button>
</div>

                    {/* Scene Info + AI Image Preview */}
                    <div className="bg-white border rounded shadow-sm p-4 space-y-6">
                        <div>
                            <h3 className="font-medium mb-2">{t('storyboard.scene_details')}</h3>
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                               {selectedScene?.description || t('storyboard.no_description')}
                            </div>
                        </div>

                        {/* AI Generated Image */}
                        <div>
                            <h3 className="font-medium mb-2">{t('storyboard.ai_reference')}</h3>
                            <div className="relative border border-dashed border-gray-300 rounded p-4 min-h-[200px] bg-gray-50 flex items-center justify-center">
                                {generating && (
    <div className="flex items-center gap-2">
        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{t('storyboard.generating')}</span>
    </div>
)}
                                {polling && <span>🔄 {t('storyboard.polling')}</span>}
                                {generatedImageStatus === "COMPLETED" && generatedImageUrl && (
    <img
     loading="lazy"
        src={generatedImageUrl.trim()}  // <-- Important again
        alt="AI Generated"
        className="max-w-full h-auto rounded shadow-md"
        onError={(e) => {
            console.error("Image failed to load", generatedImageUrl);
            e.target.onerror = null;
            e.target.src = "/fallback-image.png"; // Optional fallback
        }}
    />
)}
                                {!generatedImageStatus && (
                                    <button
                                        onClick={generateAIReference}
                                        disabled={generating}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                                    >
                                         {t('storyboard.generate_reference')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save All Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSaveAll}
                        className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-md"
                    >
                        {t('storyboard.save_all')}
                    </button>
                </div>
            </div>
        </div>
    );
}