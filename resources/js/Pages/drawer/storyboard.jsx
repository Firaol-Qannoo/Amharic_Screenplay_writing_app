import React, { useState, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf'; // jsPDF is installed
import axios from 'axios';
import flasher from '@flasher/flasher';

// Enhanced asset categories and mock assets
const assetCategories = [
    'Scenes', 'Characters', 'Props', 'Backgrounds', 'Effects', 'Text'
];

const mockAssets = {
    Scenes: [
        { url: 'https://placehold.co/80x60/87ceeb/fff?text=Indoor', name: 'Indoor Scene' },
        { url: 'https://placehold.co/80x60/4682b4/fff?text=Outdoor', name: 'Outdoor Scene' },
        { url: 'https://placehold.co/80x60/4169e1/fff?text=Night', name: 'Night Scene' },
        { url: 'https://placehold.co/80x60/ffd700/fff?text=Day', name: 'Day Scene' },
    ],
    Characters: [
        { url: 'https://placehold.co/80x60/dda0dd/fff?text=Person1', name: 'Person 1' },
        { url: 'https://placehold.co/80x60/ba55d3/fff?text=Person2', name: 'Person 2' },
        { url: 'https://placehold.co/80x60/9370db/fff?text=Person3', name: 'Person 3' },
        { url: 'https://placehold.co/80x60/8a2be2/fff?text=Person4', name: 'Person 4' },
    ],
    Props: [
        { url: 'https://placehold.co/80x60/f0e68c/fff?text=Prop1', name: 'Prop 1' },
        { url: 'https://placehold.co/80x60/ffd700/fff?text=Prop2', name: 'Prop 2' },
        { url: 'https://placehold.co/80x60/daa520/fff?text=Prop3', name: 'Prop 3' },
        { url: 'https://placehold.co/80x60/b8860b/fff?text=Prop4', name: 'Prop 4' },
    ],
    Backgrounds: [
        { url: 'https://placehold.co/80x60/98fb98/fff?text=Nature', name: 'Nature' },
        { url: 'https://placehold.co/80x60/00fa9a/fff?text=City', name: 'City' },
        { url: 'https://placehold.co/80x60/32cd32/fff?text=Office', name: 'Office' },
        { url: 'https://placehold.co/80x60/228b22/fff?text=Home', name: 'Home' },
    ],
    Effects: [
        { url: 'https://placehold.co/80x60/ff69b4/fff?text=Effect1', name: 'Effect 1' },
        { url: 'https://placehold.co/80x60/ff1493/fff?text=Effect2', name: 'Effect 2' },
        { url: 'https://placehold.co/80x60/c71585/fff?text=Effect3', name: 'Effect 3' },
        { url: 'https://placehold.co/80x60/db7093/fff?text=Effect4', name: 'Effect 4' },
    ],
    Text: [
        { url: 'https://placehold.co/80x60/ffffff/000?text=Title', name: 'Title' },
        { url: 'https://placehold.co/80x60/ffffff/000?text=Subtitle', name: 'Subtitle' },
        { url: 'https://placehold.co/80x60/ffffff/000?text=Caption', name: 'Caption' },
        { url: 'https://placehold.co/80x60/ffffff/000?text=Dialog', name: 'Dialog' },
    ],
};

function DrawingCanvas({ width, height, penColor, penSize, onSave, image, background }) {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    // Load existing image or background if present
    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            if (background) {
                const bgImg = new window.Image();
                bgImg.onload = () => {
                    ctx.drawImage(bgImg, 0, 0, width, height);
                    if (image) {
                        const img = new window.Image();
                        img.onload = () => {
                            ctx.drawImage(img, 0, 0, width, height);
                        };
                        img.src = image;
                    }
                };
                bgImg.src = background;
            } else if (image) {
                const img = new window.Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, width, height);
                };
                img.src = image;
            }
        }
    }, [image, background, width, height]);

    const handleMouseDown = (e) => {
        setDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        setLastPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };
    const handleMouseUp = () => {
        setDrawing(false);
        if (onSave && canvasRef.current) {
            onSave(canvasRef.current.toDataURL('image/png'));
        }
    };
    const handleMouseMove = (e) => {
        if (!drawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        setLastPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };
    const handleClear = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            if (onSave) onSave('');
        }
    };
    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="border rounded bg-white cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
            <button className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={handleClear} type="button">Clear</button>
        </div>
    );
}

export default function StoryboardEditor() {
    const { storyboardCells: initialCells = [], scriptID, scenes = [], auth, flash } = usePage().props;
    console.log('StoryboardEditor props:', { initialCells, scriptID, scenes, auth, flash });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [storyboardCells, setStoryboardCells] = useState(initialCells || []);
    const [selectedCell, setSelectedCell] = useState(null);
    const [mode, setMode] = useState('prebuilt');
    const [penColor, setPenColor] = useState('#222222');
    const [penSize, setPenSize] = useState(4);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const dragItem = useRef();
    const dragOverItem = useRef();
    const [isMoving, setIsMoving] = useState(false);
    const [moveTarget, setMoveTarget] = useState(null);

    // Add history state for undo/redo
    const [history, setHistory] = useState([initialCells || []]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Check if user is authenticated
    if (!auth?.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                    <p className="text-muted-foreground mb-6">
                        Please log in to access the storyboard.
                    </p>
                    <Button onClick={() => router.visit('/login')}>
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            flasher.success(flash.success);
        }
        if (flash?.error) {
            flasher.error(flash.error);
        }
    }, [flash]);

    // Load initial data
    useEffect(() => {
        if (initialCells.length === 0 && !scriptID) {
            router.get('/drawer/storyboard', {}, {
                preserveState: true,
                onSuccess: (page) => {
                    console.log('Loaded storyboard cells:', page.props.storyboardCells);
                    setStoryboardCells(page.props.storyboardCells || []);
                },
                onError: (errors) => {
                    console.error('Error loading storyboard cells:', errors);
                    flasher.error('Failed to load storyboard cells: ' + (errors.message || 'Unknown error'));
                }
            });
        }
    }, []); // Only run once on mount

    // Function to add state to history
    const addToHistory = (newState) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    // Undo function
    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setStoryboardCells(history[newIndex]);
        }
    };

    // Redo function
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setStoryboardCells(history[newIndex]);
        }
    };

    // Scene selection for each cell
    const handleSceneChange = (idx, sceneID) => {
        const updatedCells = [...storyboardCells];
        updatedCells[idx] = {
            ...updatedCells[idx],
            sceneID,
        };
        setStoryboardCells(updatedCells);
        addToHistory(updatedCells);
    };

    // Duplicate cell
    const handleDuplicateCell = (idx) => {
        const cell = storyboardCells[idx];
        const newCell = { ...cell, id: Date.now() + Math.random() };
        const updatedCells = [
            ...storyboardCells.slice(0, idx + 1),
            newCell,
            ...storyboardCells.slice(idx + 1),
        ];
        setStoryboardCells(updatedCells);
        addToHistory(updatedCells);
    };

    // Drag-and-drop reordering
    const handleDragStart = (idx) => {
        dragItem.current = idx;
        // Add visual feedback
        const element = document.querySelector(`[data-cell-index="${idx}"]`);
        if (element) {
            element.classList.add('opacity-50');
        }
    };

    const handleDragEnter = (idx) => {
        dragOverItem.current = idx;
        // Add visual feedback for drop target
        const element = document.querySelector(`[data-cell-index="${idx}"]`);
        if (element) {
            element.classList.add('border-primary', 'border-2');
        }
    };

    const handleDragLeave = (idx) => {
        // Remove visual feedback
        const element = document.querySelector(`[data-cell-index="${idx}"]`);
        if (element) {
            element.classList.remove('border-primary', 'border-2');
        }
    };

    const handleDrop = () => {
        const copy = [...storyboardCells];
        const dragIdx = dragItem.current;
        const overIdx = dragOverItem.current;

        if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
            const draggedCell = copy.splice(dragIdx, 1)[0];
            copy.splice(overIdx, 0, draggedCell);
            setStoryboardCells(copy);
            addToHistory(copy);
        }

        // Remove all visual feedback
        document.querySelectorAll('[data-cell-index]').forEach(el => {
            el.classList.remove('opacity-50', 'border-primary', 'border-2');
        });

        dragItem.current = null;
        dragOverItem.current = null;
    };

    // Export as PDF (real implementation)
    const handleExportPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        storyboardCells.forEach((cell, idx) => {
            if (idx > 0) doc.addPage();
            doc.setFontSize(18);
            doc.text(`Cell ${idx + 1}`, 40, 40);
            if (cell.desc) {
                doc.setFontSize(12);
                doc.text(cell.desc, 40, 70, { maxWidth: pageWidth - 80 });
            }
            if (cell.image_ur) {
                // Only add if it's a data URL
                if (cell.image_ur.startsWith('data:image')) {
                    doc.addImage(cell.image_ur, 'PNG', 40, 100, pageWidth - 80, 250, undefined, 'FAST');
                } else {
                    // Remote images are not included in the PDF export
                }
            }
        });
        doc.save('storyboard.pdf');
    };

    // Print
    const handlePrint = () => {
        window.print();
    };

    // Add a new cell (associate with a sceneID)
    const handleAddCell = () => {
        const sceneID = scenes.length > 0 ? scenes[0].id : null;
        const newCell = {
            id: Date.now(),
            sceneID,
            scriptID,
            image_ur: null,
            desc: '',
        };
        setStoryboardCells([...storyboardCells, newCell]);
        setSelectedCell(storyboardCells.length); // Select the new cell
    };

    // Select a cell
    const handleSelectCell = (idx) => {
        setSelectedCell(idx);
    };

    // Update description for the selected cell
    const handleDescChange = (e) => {
        if (selectedCell === null) return;
        const updatedCells = [...storyboardCells];
        updatedCells[selectedCell] = {
            ...updatedCells[selectedCell],
            desc: e.target.value,
        };
        setStoryboardCells(updatedCells);
        addToHistory(updatedCells);
    };

    // Handle asset selection for prebuilt mode
    const handleAssetSelect = (assetUrl) => {
        if (selectedCell === null) return;
        const updatedCells = [...storyboardCells];
        updatedCells[selectedCell] = {
            ...updatedCells[selectedCell],
            image_ur: assetUrl,
        };
        setStoryboardCells(updatedCells);
        addToHistory(updatedCells);
    };

    // Handle drawing save
    const handleDrawingSave = (imgData) => {
        if (selectedCell === null) return;
        const updatedCells = [...storyboardCells];
        updatedCells[selectedCell] = {
            ...updatedCells[selectedCell],
            image_ur: imgData,
        };
        setStoryboardCells(updatedCells);
        addToHistory(updatedCells);
    };

    // Get the currently selected cell
    const currentCell = selectedCell !== null ? storyboardCells[selectedCell] : null;
    const currentScene = currentCell ? scenes.find(s => s.id === currentCell.sceneID) : null;
    const sceneDescription = currentScene?.sceneDesc?.text || '';

    // Save all cells (create new or update existing)
    const handleSave = async () => {
        try {
            const savePromises = storyboardCells.map(cell => {
                const cellData = {
                    sceneID: cell.sceneID,
                    scriptID: scriptID,
                    image_ur: cell.image_ur,
                    desc: cell.desc,
                };

                if (!cell._id) {
                    // Create new cell
                    return router.post('/storyboard', cellData, {
                        preserveScroll: true,
                        onSuccess: () => {
                            flasher.success('Storyboard cell created successfully!');
                        },
                        onError: (errors) => {
                            flasher.error('Failed to create storyboard cell: ' + (errors.message || 'Unknown error'));
                        }
                    });
                } else {
                    // Update existing cell
                    return router.put(`/storyboard/${cell._id}`, cellData, {
                        preserveScroll: true,
                        onSuccess: () => {
                            flasher.success('Storyboard cell updated successfully!');
                        },
                        onError: (errors) => {
                            flasher.error('Failed to update storyboard cell: ' + (errors.message || 'Unknown error'));
                        }
                    });
                }
            });

            await Promise.all(savePromises);
            router.reload({ preserveScroll: true });
        } catch (error) {
            console.error('Error saving storyboard:', error);
            flasher.error('Failed to save storyboard. Please try again.');
        }
    };

    // Delete a cell
    const handleDeleteCell = (idx) => {
        const cell = storyboardCells[idx];
        if (cell._id) {
            router.delete(`/storyboard/${cell._id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    flasher.success('Storyboard cell deleted successfully!');
                    router.reload({ preserveScroll: true });
                },
                onError: (errors) => {
                    flasher.error('Failed to delete storyboard cell: ' + (errors.message || 'Unknown error'));
                }
            });
        }
        const updatedCells = storyboardCells.filter((_, i) => i !== idx);
        setStoryboardCells(updatedCells);
        setSelectedCell(null);
    };

    // Move cell function
    const handleMoveCell = () => {
        if (selectedCell === null) return;
        setIsMoving(true);
    };

    // Handle cell move target selection
    const handleMoveTarget = (targetIdx) => {
        if (!isMoving || selectedCell === null) return;

        const updatedCells = [...storyboardCells];
        const cellToMove = updatedCells[selectedCell];
        updatedCells.splice(selectedCell, 1);
        updatedCells.splice(targetIdx, 0, cellToMove);

        setStoryboardCells(updatedCells);
        addToHistory(updatedCells);
        setSelectedCell(targetIdx);
        setIsMoving(false);
        setMoveTarget(null);
    };

    // Cancel move operation
    const handleCancelMove = () => {
        setIsMoving(false);
        setMoveTarget(null);
    };

    // Handle AI image generation
    const handleAIGenerate = async () => {
        if (selectedCell === null) return;
        setAiLoading(true);

        try {
            const response = await axios.post('/storyboard/generate-image', {
                prompt: aiPrompt || sceneDescription || 'Scene',
                scriptID: scriptID
            });

            if (response.data.success && response.data.image_url) {
                const updatedCells = [...storyboardCells];
                updatedCells[selectedCell] = {
                    ...updatedCells[selectedCell],
                    image_ur: response.data.image_url,
                };
                setStoryboardCells(updatedCells);
                addToHistory(updatedCells);
                flasher.success('Image generated successfully!');
            }
        } catch (error) {
            console.error('AI Generation Error:', error);
            flasher.error('Failed to generate image: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setAiLoading(false);
        }
    };

    // Replace the real-time collaboration useEffect with a safer Inertia approach
    useEffect(() => {
        if (scriptID) {
            // Set up polling to check for updates
            const interval = setInterval(() => {
                router.reload({
                    preserveState: true,
                    preserveScroll: true,
                    only: ['storyboardCells']
                });
            }, 5000); // Poll every 5 seconds

            return () => clearInterval(interval);
        }
    }, [scriptID]);

    return (
        <div className="flex flex-col min-h-screen w-full bg-background">
            {/* Top Bar: Asset Categories */}
            <div className="bg-background/80 border-b px-4 py-2 flex flex-col shadow-sm sticky top-0 z-30">
                <div className="flex gap-2 mb-2 overflow-x-auto">
                    {assetCategories.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? 'default' : 'outline'}
                            className={cn('rounded-lg font-medium', selectedCategory === cat && 'shadow')}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
                {selectedCategory && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {mockAssets[selectedCategory].map((asset) => (
                            <Card key={asset.url} className="w-20 h-14 p-0 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-all duration-150 shadow-sm"
                                onClick={() => handleAssetSelect(asset.url)}
                                title={asset.name}
                            >
                                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover rounded" />
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Storyboard Cells */}
                <div className="w-72 bg-background border-r flex flex-col py-4 shadow-sm overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
                    <div className="flex-1 flex flex-col gap-5">
                        {storyboardCells.length === 0 ? (
                            <div className="text-center text-muted-foreground mt-4">[No Cells]</div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {storyboardCells.map((cell, idx) => (
                                    <Card
                                        key={cell.id}
                                        className={cn(
                                            'group relative w-60 h-48 mx-auto flex flex-col items-center justify-center text-xs transition-all duration-150 cursor-pointer border',
                                            selectedCell === idx ? 'border-primary bg-primary/10 shadow-lg' : 'border-border bg-background hover:bg-muted/50',
                                            isMoving && 'cursor-move',
                                            isMoving && moveTarget === idx && 'border-dashed border-2 border-primary'
                                        )}
                                        draggable
                                        onDragStart={() => handleDragStart(idx)}
                                        onDragEnter={() => handleDragEnter(idx)}
                                        onDragLeave={() => handleDragLeave(idx)}
                                        onDragEnd={handleDrop}
                                        onClick={() => isMoving ? handleMoveTarget(idx) : handleSelectCell(idx)}
                                        onMouseEnter={() => isMoving && setMoveTarget(idx)}
                                        onMouseLeave={() => isMoving && setMoveTarget(null)}
                                    >
                                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <Button size="sm" variant="outline" className="px-1 py-0.5" onClick={e => { e.stopPropagation(); handleDuplicateCell(idx); }}>⧉</Button>
                                            <Button size="sm" variant="destructive" className="px-1 py-0.5" onClick={e => { e.stopPropagation(); handleDeleteCell(idx); }}>✕</Button>
                                        </div>
                                        <div className="mb-1 font-bold text-primary">{idx + 1}</div>
                                        {cell.image_ur ? (
                                            <img src={cell.image_ur} alt="thumb" className="w-40 h-28 rounded object-cover border" />
                                        ) : (
                                            <div className="text-muted-foreground">[Thumb]</div>
                                        )}
                                        <div className="w-full mt-1">
                                            <Select value={cell.sceneID || ''} onValueChange={val => handleSceneChange(idx, val)}>
                                                <SelectTrigger className="w-full text-xs rounded border bg-background focus:ring-primary focus:border-primary">
                                                    <SelectValue placeholder="Select Scene" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {scenes.map(scene => (
                                                        <SelectItem key={scene.id} value={scene.id}>
                                                            {scene.sceneHead?.text || `Scene ${scene.scene_num}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button className="m-4 w-56" onClick={handleAddCell}>+ Add Cell</Button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Mode Switcher - Fixed */}
                    <div className="flex gap-4 py-4 bg-background border-b sticky top-0 z-20 justify-center">
                        <Button onClick={() => setMode('prebuilt')} variant={mode === 'prebuilt' ? 'default' : 'outline'}>Prebuilt</Button>
                        <Button onClick={() => setMode('drawing')} variant={mode === 'drawing' ? 'default' : 'outline'}>Drawing</Button>
                        <Button onClick={() => setMode('ai')} variant={mode === 'ai' ? 'default' : 'outline'}>AI</Button>
                    </div>

                    {/* Scrollable Canvas Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-8" style={{ height: 'calc(100vh - 180px)' }}>
                        <div className="flex flex-col items-center">
                            {/* Main Canvas */}
                            <Card className="w-full max-w-6xl h-[700px] flex items-center justify-center relative bg-background rounded-xl shadow-xl border">
                                {currentCell && (
                                    <Select value={currentCell.sceneID || ''} onValueChange={val => handleSceneChange(selectedCell, val)}>
                                        <SelectTrigger className="absolute top-2 left-2 text-xs rounded border bg-background focus:ring-primary focus:border-primary z-10 w-72">
                                            <SelectValue placeholder="Select Scene" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {scenes.map(scene => (
                                                <SelectItem key={scene.id} value={scene.id}>
                                                    {scene.sceneHead?.text || `Scene ${scene.scene_num}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {/* AI mode */}
                                {mode === 'ai' && currentCell ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <Label className="mb-1">AI Prompt</Label>
                                        <Textarea
                                            className="w-4/5 mb-2 text-lg"
                                            placeholder="Describe the scene for AI..."
                                            value={aiPrompt !== '' ? aiPrompt : sceneDescription}
                                            onChange={e => setAiPrompt(e.target.value)}
                                            rows={3}
                                        />
                                        <Button
                                            className="mb-2 px-4 py-1"
                                            variant="default"
                                            onClick={handleAIGenerate}
                                            disabled={aiLoading}
                                        >
                                            {aiLoading ? 'Generating...' : 'Generate with AI'}
                                        </Button>
                                        {currentCell.image_ur && (
                                            <img src={currentCell.image_ur} alt="AI Generated" className="w-full h-[500px] object-contain rounded border" />
                                        )}
                                    </div>
                                ) : mode === 'drawing' && currentCell ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <div className="flex gap-4 mb-4 items-center">
                                            <Label className="flex items-center gap-1 text-lg">
                                                Color:
                                                <input type="color" value={penColor} onChange={e => setPenColor(e.target.value)} />
                                            </Label>
                                            <Label className="flex items-center gap-1 text-lg">
                                                Size:
                                                <input type="range" min="1" max="20" value={penSize} onChange={e => setPenSize(Number(e.target.value))} />
                                                <span>{penSize}</span>
                                            </Label>
                                        </div>
                                        <DrawingCanvas
                                            width={900}
                                            height={600}
                                            penColor={penColor}
                                            penSize={penSize}
                                            onSave={handleDrawingSave}
                                            image={currentCell.image_ur && !mockAssets["Scenes"]?.some(a => a.url === currentCell.image_ur) ? currentCell.image_ur : null}
                                            background={mockAssets["Scenes"]?.some(a => a.url === currentCell.image_ur) ? currentCell.image_ur : null}
                                        />
                                    </div>
                                ) : mode === 'prebuilt' && currentCell && currentCell.image_ur ? (
                                    <img src={currentCell.image_ur} alt="Selected Asset" className="w-full h-[500px] object-contain rounded-xl" />
                                ) : (
                                    <div className="text-muted-foreground w-full text-center">
                                        {currentCell ? (
                                            <>[Main Canvas: {mode} mode | Cell {selectedCell + 1}]</>
                                        ) : (
                                            <>[Select or add a cell]</>
                                        )}
                                    </div>
                                )}
                                {/* AI Icon/Button (right side, visible in all modes) */}
                                <Button
                                    className="absolute right-2 top-2 rounded-full p-2 shadow-lg z-10"
                                    variant="secondary"
                                    title="Generate with AI"
                                    onClick={() => setMode('ai')}
                                >
                                    <span role="img" aria-label="AI">🤖</span>
                                </Button>
                            </Card>

                            {/* Description Field */}
                            <Textarea
                                className="mt-8 w-full max-w-6xl border rounded-lg p-6 bg-background shadow text-xl mb-20"
                                placeholder="Scene description..."
                                value={currentCell ? currentCell.desc : ''}
                                onChange={handleDescChange}
                                disabled={currentCell === null}
                                rows={6}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Toolbar (always fixed) */}
            <div className="w-full bg-background border-t py-3 px-4 flex flex-wrap gap-4 justify-center items-center fixed bottom-0 left-0 z-50 shadow-lg">
                
                <Button variant="outline" onClick={handleUndo} disabled={historyIndex === 0}>Undo</Button>
                <Button variant="outline" onClick={handleRedo} disabled={historyIndex === history.length - 1}>Redo</Button>
                <Button variant="default" onClick={handleSave}>Save</Button>
                <Button variant="secondary" onClick={handleExportPDF}>Export PDF</Button>
                <Button variant="secondary" onClick={handlePrint}>Print</Button>
            </div>
        </div>
    );
}
