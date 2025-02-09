import React from 'react';
import {Link} from 'react-router-dom';
import {Home, Box, BarChart} from 'lucide-react';

const Sidebar = ({isSidebarOpen}) => {
    return (
        <aside
            className={`w-64 bg-gray-100 text-gray-800 h-full fixed top-0 left-0 z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-300`}>
            <nav className="mt-16">
                <ul className="space-y-2 px-4">
                    <li>
                        <Link to="/"
                              className="flex items-center p-3 hover:bg-gray-200 transition duration-300">
                            <Home className="mr-3" size={20}/> Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/inventory"
                              className="flex items-center p-3 hover:bg-gray-200 transition duration-300">
                            <Box className="mr-3" size={20}/> Inventory
                        </Link>
                    </li>
                    <li>
                        <Link to="/products"
                              className="flex items-center p-3 hover:bg-gray-200 transition duration-300">
                            <Box className="mr-3" size={20}/> Products
                        </Link>
                    </li>
                    <li>
                        <Link to="/reports" className="flex items-center p-3 hover:bg-gray-200 transition duration-300">
                            <BarChart className="mr-3" size={20}/> Reports
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
