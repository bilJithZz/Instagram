// Notification.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/notifications'); 
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-container">
      <div className="notification-dropdown">
        <ul className="notification-list">
          {notifications.map(notification => (
            <li key={notification.id} className="notification-item">
              <div className="notification-text">
                {notification.type === 'like' ? (
                  <>
                    <strong>{notification.senderUsername}</strong> liked your post.
                  </>
                ) : (
                  <>
                    <strong>{notification.senderUsername}</strong> started following you.
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
