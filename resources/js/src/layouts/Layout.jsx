import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
                <main className="flex-1  bg-gray-50 shadow-inner overflow-auto">
                    <Outlet/>
                </main>
                <footer className="bg-gray-200 text-gray-700 p-4 text-center shadow-inner">
                    &copy; {new Date().getFullYear()} Poultry Nexus. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Layout;
