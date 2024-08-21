import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Home/Sidebar';
import "./Layout.css"

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
