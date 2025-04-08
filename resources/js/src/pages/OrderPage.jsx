import React from 'react';
import OrderList from '../components/Order/OrderList.jsx';

const InventoryPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Orders Dashboard</h1>
            <OrderList />
        </div>
    );
};

export default InventoryPage;
