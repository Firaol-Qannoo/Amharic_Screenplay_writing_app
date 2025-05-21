import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function StoryboardPage({ scriptId, frames }) {
    const [localFrames, setLocalFrames] = useState(frames || []);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);

    // Load selected scene
    const selectedScene = localFrames[currentSceneIndex];

    // Initialize canvases after render
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
        ctx.stroke();
    };

    const handleMouseUpOrLeave = (e) => {
        setIsDrawing(false);
        const canvas = e.target;
        const imageData = canvas.toDataURL(); // Save current image
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

            if (!response.ok) throw new Error('Failed to save');
            alert('Saved!');
        } catch (error) {
            console.error('Error saving frame:', error);
        }
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

            if (!response.ok) throw new Error('Save failed');
            alert('All sketches saved!');
        } catch (error) {
            console.error('Error saving storyboard:', error);
            alert('Failed to save');
        }
    };

    const selectScene = (index) => {
        setCurrentSceneIndex(index);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto flex gap-6">
            {/* Scene List Sidebar */}
            <div className="w-1/4 bg-white border rounded shadow-sm p-4 h-fit sticky top-6">
                <h2 className="font-semibold mb-4">Scenes</h2>
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
                                {frame.heading || 'Untitled Scene'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Canvas + Description */}
            <div className="flex-1 space-y-6">
                {/* Back Button */}
                <Link href={`/scripts/${scriptId}`} className="text-blue-600 hover:text-blue-800 inline-block">
                    ← Back to Script Editor
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Canvas */}
                    <div className="border rounded shadow-sm p-4 bg-white">
                        <h3 className="font-medium mb-2">
                            Draw for Scene: {selectedScene?.heading || 'Untitled Scene'}
                        </h3>
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
                            placeholder="Add notes here..."
                            value={selectedScene?.notes || ''}
                            onChange={(e) => updateLocalFrame(selectedScene.scene_json_id, 'notes', e.target.value)}
                            className="mt-3 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={() => handleSaveSingle(selectedScene)}
                            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                        >
                            Save Frame
                        </button>
                    </div>

                    {/* Scene Info */}
                    <div className="bg-white border rounded shadow-sm p-4">
                        <h3 className="font-medium mb-2">Scene Details</h3>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                            {selectedScene?.description || "No description available."}
                        </div>
                    </div>
                </div>

                {/* Save All Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSaveAll}
                        className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-md"
                    >
                        Save All
                    </button>
                </div>
            </div>
        </div>
    );
}