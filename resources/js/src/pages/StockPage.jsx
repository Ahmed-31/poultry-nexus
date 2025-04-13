import React from 'react';
import StockOverviewDashboard from '../components/Stock/StockOverviewDashboard.jsx';

const StockPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Stock Dashboard</h1>
            <StockOverviewDashboard />
        </div>
    );
};

export default StockPage;
