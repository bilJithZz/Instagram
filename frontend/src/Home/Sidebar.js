import React from 'react';
import './Sidebar.css';
import { House, MessageCircleCode, Search, Film, CirclePlus, Heart, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram Logo" className="sidebar-logo" />
      </div>
      <ul className="sidebar-menu">
        <Link to="/" className="sidebar-link"><li><House /> Home</li></Link>
        <Link to="/messege" className="sidebar-link"><li><MessageCircleCode /> Messages</li></Link>
        <li><Search /> Search</li>
        <li><Film /> Reels</li>
        <Link to="/createpost" className="sidebar-link"><li><CirclePlus /> Create</li></Link>
        <li><Heart /> Notifications</li>
        <Link to="/profileid" className="sidebar-link"><li><User /> Profile</li></Link>
      </ul>
      <div className="sidebar-logout">
        <span><LogOut /> Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
