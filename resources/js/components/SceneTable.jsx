import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SceneTable({ scenes, onBack }) {
    const { t } = useTranslation();
    const [localScenes, setLocalScenes] = useState(scenes);
    const [savingIndex, setSavingIndex] = useState(null);

    const handleLocationChange = (index, value) => {
        const updated = [...localScenes];
        updated[index].shoot_location = value;
        setLocalScenes(updated);
    };

    const handleSave = async (scene, index) => {
        setSavingIndex(index);

        try {
            const response = await fetch('/production-schedule/save-locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    scenes: [{
                        id: scene.json_id,
                        shoot_location: scene.shoot_location
                    }]
                })
            });

            if (!response.ok) throw new Error('Save failed');
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSavingIndex(null);
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("scene-table.scene")}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("scene-table.interiorExterior")}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("scene-table.sceneSetting")}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("scene-table.dayNight")}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("scene-table.characters")}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("scene-table.shootLocation")}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("scene-table.actions")}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {localScenes.map((scene, index) => (
                        <tr key={scene.json_id}>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.scene_num}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.location_type}</td>
                            <td className="px-6 py-4">
                                <div className="font-medium">{scene.location}</div>
                                <div className="text-sm text-gray-500">{scene.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.time_of_day}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.cast_ids?.join(', ')}</td>

                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    value={scene.shoot_location || ''}
                                    onChange={(e) => handleLocationChange(index, e.target.value)}
                                   placeholder={t("scene-table.setLocationPlaceholder")}
                                />
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => handleSave(scene, index)}
                                    disabled={savingIndex === index}
                                    className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                                        savingIndex === index
                                            ? 'bg-black cursor-not-allowed'
                                            : 'bg-black hover:bg-black'
                                    }`}
                                >
                                   {savingIndex === index ? t("scene-table.saving") : t("scene-table.save")}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="px-6 py-4 flex justify-start">
    <button
        onClick={() => window.history.back()}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
    >
        ← {t("scene-table.back")}
    </button>
</div>
        </div>
    );
}