import React from 'react';
import {Link} from 'react-router-dom';
import {UserCircle, Menu, X} from 'lucide-react';

const Navbar = ({toggleSidebar, isSidebarOpen}) => {
    return (
        <nav className="bg-gray-100 text-gray-800 p-4 shadow-inner flex justify-between items-center">
            <div className="flex items-center">
                <button onClick={toggleSidebar}
                        className="text-gray-800 p-2 mr-4 hover:bg-gray-200 transition duration-300">
                    {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
                <Link to="/" className="font-bold text-xl">Poultry Nexus</Link>
            </div>
            <div className="flex items-center space-x-6">
                <Link to="/profile" className="hover:text-gray-600 flex items-center transition duration-300">
                    <UserCircle className="mr-2" size={22}/> Profile
                </Link>
                <Link to="/logout" className="hover:text-gray-600 transition duration-300">Logout</Link>
            </div>
        </nav>
    )
};

export default Navbar;
