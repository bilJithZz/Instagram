// Notification.js
import React, { useState } from 'react';
import './Notification.css'; // Ensure the correct import path

const notifications = [
    { id: 1, text: 'John liked your photo', time: '2m ago' },
    { id: 2, text: 'Sarah commented on your post', time: '10m ago' },
    { id: 3, text: 'Mike started following you', time: '1h ago' },
];

const Notification = () => {

    return (
        <div className="notification-container">
          
                <div className="notification-dropdown">
                    <ul className="notification-list">
                        {notifications.map(notification => (
                            <li key={notification.id} className="notification-item">
                                <div className="notification-text">{notification.text}</div>
                                {/* <div className="notification-time">{notification.time}</div> */}
                            </li>
                        ))}
                    </ul>
                </div>
            
        </div>
    );
};

export default Notification;
