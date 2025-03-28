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
        <div className="flex min-h-screen">
            <div className={`transition-all  duration-300 ${isSidebarOpen ? "inline-flex w-auto" : "hidden"}`}>
                <Sidebar isSidebarOpen={isSidebarOpen}/>
            </div>

            <div className="flex-1 flex flex-col min-h-screen">
                <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
                <main className="flex-1 bg-gray-50 shadow-inner overflow-auto p-4">
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
