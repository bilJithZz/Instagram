import React from 'react';
import './Sidebar.css';
import { House, MessageCircleCode, Search, Film, CirclePlus, Heart, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const token = window.localStorage.getItem('token'); 

      await axios.get("http://localhost:5000/api/user/logout", {
        headers: {
          'Authorization': `Bearer ${token}` // Pass the token in the Authorization header
        },
        withCredentials: true
      });

      console.log("Logout success:");
      window.localStorage.setItem("isLoggedIn", "false"); 
      window.localStorage.removeItem("token"); // Remove the token from local storage
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
  };

  const goToUserProfile = async () => {
    try {
      const token = window.localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userId = response.data.id;
      navigate(`/getpost/${userId}`);
    } catch (error) {
      console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram Logo" className="sidebar-logo" />
      </div>
      <ul className="sidebar-menu">
        <Link to="/" className="sidebar-link">
          <li><House /> Home</li>
        </Link>
        <Link to="/message" className="sidebar-link">
          <li><MessageCircleCode /> Messages</li>
        </Link>
        <li><Search /> Search</li>
        <li><Film /> Reels</li>
        <Link to="/createpost" className="sidebar-link">
          <li><CirclePlus /> Create</li>
        </Link>
        <li><Heart /> Notifications</li>
        <li className="sidebar-link" onClick={goToUserProfile}>
          <User /> Profile
        </li>
      </ul>
      <div className="sidebar-logout" onClick={logout}>
        <span><LogOut /> Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
