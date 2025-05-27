import React, { useState } from 'react';

const API_BASE_URL = "http://localhost:4800";

export default function AiAssistantDialog({ isOpen, onClose, initialContext = "", includeScriptContext = true }) {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useScriptContext, setUseScriptContext] = useState(includeScriptContext);

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        setResponse('');

        try {
            const res = await fetch(`${API_BASE_URL}/ai-assistance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    context: useScriptContext ? initialContext : '',
                }),
            });

            const data = await res.json();
            setResponse(data.response || data.error);
        } catch (err) {
            setResponse("አስተያየት አልተሰራም። እባክዎ ተጠቃሚውን ይሞክሩ።");
        }

        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">AI አደርጎ</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    ✕
                </button>
            </div>

            <div className="px-4 py-3 border-b flex items-center gap-2">
                <input
                    type="checkbox"
                    id="contextToggle"
                    checked={useScriptContext}
                    onChange={(e) => setUseScriptContext(e.target.checked)}
                    className="rounded text-blue-600"
                />
                <label htmlFor="contextToggle" className="text-sm">
                    የስክሪፕቱን መረጃ ያካትቱ
                </label>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ጥያቄዎን አስገባ..."
                    className="w-full h-24 p-2 border rounded"
                />

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-black disabled:bg-black w-full"
                >
                    {isLoading ? 'በመላክ ላይ...' : 'ላክ'}
                </button>

                {response && (
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        <strong>መልስ:</strong>
                        <p className="whitespace-pre-wrap mt-1">{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
}