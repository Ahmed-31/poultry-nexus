// resources/js/src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import './styles/app.css';

const App = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <AppRoutes/>
        </div>
    );
};

export default App;
