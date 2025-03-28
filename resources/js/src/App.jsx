// resources/js/src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import './styles/app.css';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";

const App = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
            <ToastContainer position='top-center' autoClose={3000} />
            <AppRoutes/>
        </div>
    );
};

export default App;
