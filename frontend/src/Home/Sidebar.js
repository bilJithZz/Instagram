import React from 'react';
import './Sidebar.css';
import {House, MessageCircleCode,Search,Film,CirclePlus,Heart ,User,LogOut} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">
        <img src="https://www.instagram.com/?next=%2F&hl=en" alt="nnn" />
      </h2>
      
      <ul className="sidebar-menu">
        <li> <House />Home</li>
        <li><MessageCircleCode />Profile</li>
        <li><Search />Messages</li>
        <li><Film />Settings</li>
        <li><CirclePlus />Settings</li>
        <li><Heart />Settings</li>
        <li><User />Settings</li>
      </ul>

      <div className="sidebar-logout">
        <span><LogOut />Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
