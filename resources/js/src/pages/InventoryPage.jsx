// resources/js/src/pages/InventoryPage.jsx
import React from 'react';
import InventoryDashboard from '../components/Inventory/InventoryDashboard.jsx';

const InventoryPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Inventory Dashboard</h1>
            <InventoryDashboard />
        </div>
    );
};

export default InventoryPage;
