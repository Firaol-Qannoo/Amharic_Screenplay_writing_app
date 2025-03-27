import React, { useState, useEffect } from "react";
import { usePage } from '@inertiajs/react';      
import { router } from '@inertiajs/react';
import "./dashboard.css";

const Dashboard = ({ user, success }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        if (success) {
            setIsVisible(true); // Show the success message
            setTimeout(() => {
                setIsVisible(false); // After 3 seconds, start hiding it
                setTimeout(() => setIsHidden(true), 500); // After another 0.5s, hide it completely
            }, 3000); // Hide the message after 3 seconds
        }
    }, [success]);

    return (
        <div className="dashboard-container">
            {/* Display the success message if it exists */}
            {success && !isHidden && (
                <div className={`success-message ${isVisible ? 'show' : ''} ${isHidden ? 'hide' : ''}`}>
                    {success}
                </div>
            )}

            <h1>Welcome, {user?.first_name}!</h1>
            <p>This is your dashboard.</p>

            <button 
                onClick={() => router.post('/logout')} 
                className="logout-button"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;