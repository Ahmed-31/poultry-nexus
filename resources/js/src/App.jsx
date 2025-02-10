// resources/js/src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import {InventoryProvider} from './context/InventoryContext';
import {OrderProvider} from './context/OrderContext';
import './styles/app.css';

const App = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <InventoryProvider>
                <OrderProvider>
                    <AppRoutes/>
                </OrderProvider>
            </InventoryProvider>
        </div>
    );
};

export default App;
