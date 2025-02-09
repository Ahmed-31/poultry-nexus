// resources/js/src/pages/InventoryPage.jsx
import React from 'react';
import InventoryList from '../components/Inventory/InventoryList.jsx';

const InventoryPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Inventory Dashboard</h1>
            <InventoryList />
        </div>
    );
};

export default InventoryPage;
