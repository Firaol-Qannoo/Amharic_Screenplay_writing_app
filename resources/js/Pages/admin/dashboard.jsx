import React, { useState, useEffect } from 'react';

import { Tab } from '@headlessui/react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard(usersr,scriptsr) {
    const [users, setUsers] = useState(usersr);
    const [scripts, setScripts] = useState(scriptsr);
    const [analytics, setAnalytics] = useState({
        userGrowth: [],
        scriptUsage: [],
        userActivity: [],
        topUsers: [],
        recentActivities: []
    });


    const handleDeleteUser = (userId) => {
       
    };

    const handleDeleteScript = (scriptId) => {
        
    };

    const userGrowthData = {
        labels: analytics.userGrowth?.map(data => data.date) || [],
        datasets: [{
            label: 'User Growth',
            data: analytics.userGrowth?.map(data => data.count) || [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const scriptUsageData = {
        labels: analytics.scriptUsage?.map(data => data.name) || [],
        datasets: [{
            label: 'Script Usage',
            data: analytics.scriptUsage?.map(data => data.usage) || [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
            ],
        }]
    };

    const userActivityData = {
        labels: analytics.userActivity?.map(data => data.hour) || [],
        datasets: [{
            label: 'User Activity by Hour',
            data: analytics.userActivity?.map(data => data.count) || [],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
        }]
    };

    return (
        <>
         
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <Tab.Group>
                        <Tab.List className="flex p-1 space-x-1 bg-gray-100">
                            <Tab className={({ selected }) =>
                                `w-full py-2.5 text-sm leading-5 font-medium rounded-lg
                                ${selected 
                                    ? 'bg-white shadow text-blue-700'
                                    : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'}`
                            }>
                                Analytics
                            </Tab>
                            <Tab className={({ selected }) =>
                                `w-full py-2.5 text-sm leading-5 font-medium rounded-lg
                                ${selected 
                                    ? 'bg-white shadow text-blue-700'
                                    : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'}`
                            }>
                                Users
                            </Tab>
                            <Tab className={({ selected }) =>
                                `w-full py-2.5 text-sm leading-5 font-medium rounded-lg
                                ${selected 
                                    ? 'bg-white shadow text-blue-700'
                                    : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'}`
                            }>
                                Scripts
                            </Tab>
                        </Tab.List>

                        <Tab.Panels className="mt-2">
                            <Tab.Panel className="p-3">
                                {/* Analytics Dashboard */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Total Users</h3>
                                        <p className="text-3xl font-bold">{analytics.totalUsers || 0}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Total Scripts</h3>
                                        <p className="text-3xl font-bold">{analytics.totalScripts || 0}</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Active Users</h3>
                                        <p className="text-3xl font-bold">{analytics.activeUsers || 0}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* User Growth Chart */}
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold mb-4">User Growth Trend</h3>
                                        <Line data={userGrowthData} />
                                    </div>

                                    {/* Script Usage Chart */}
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold mb-4">Script Usage Distribution</h3>
                                        <Pie data={scriptUsageData} />
                                    </div>

                                    {/* User Activity Chart */}
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold mb-4">User Activity by Hour</h3>
                                        <Bar data={userActivityData} />
                                    </div>

                                    {/* Top Users List */}
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold mb-4">Top Active Users</h3>
                                        <div className="space-y-2">
                                            {analytics.topUsers?.map((user, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <span>{user.name}</span>
                                                    <span className="text-blue-600">{user.activity} actions</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activities */}
                                <div className="mt-6 bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                                    <div className="space-y-2">
                                        {analytics.recentActivities?.map((activity, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 border-b">
                                                <div>
                                                    <p className="font-medium">{activity.user}</p>
                                                    <p className="text-sm text-gray-500">{activity.action}</p>
                                                </div>
                                                <span className="text-sm text-gray-400">{activity.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Tab.Panel>

                            <Tab.Panel className="p-3">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users?.map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{user.first_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>

                            <Tab.Panel className="p-3">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {scripts.map(script => (
                                                <tr key={script.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{script.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{script.creator}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleDeleteScript(script.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </>
    );
}

