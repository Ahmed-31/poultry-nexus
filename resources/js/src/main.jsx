import React from 'react';
import './i18n';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);
