import React from 'react';

export default function SceneTable({ scenes }) {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scene</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">I/E</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scene Setting</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">D/N</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cast ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shoot Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {scenes.map((scene) => (
                        <tr key={scene.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <span className="font-medium">{scene.scene_num}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.location_type}</td>
                            <td className="px-6 py-4">
                                <div className="font-medium">{scene.location}</div>
                                <div className="text-sm text-gray-500">{scene.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.time_of_day}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.cast_ids?.join(', ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.shoot_location}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{scene.pages}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-indigo-600 hover:text-indigo-900 cursor-pointer">🔍</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}