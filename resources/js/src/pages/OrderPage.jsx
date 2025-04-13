import React from 'react';
import OrderList from '@/src/components/Order/OrderList.jsx';

const OrderPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Orders Dashboard</h1>
            <OrderList />
        </div>
    );
};

export default OrderPage;
