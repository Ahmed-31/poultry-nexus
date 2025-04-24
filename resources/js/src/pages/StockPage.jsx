import React from 'react';
import StockOverviewDashboard from '../components/Stock/Items/StockOverviewDashboard.jsx';
import {useTranslation} from "react-i18next";

const StockPage = () => {
    const {t} = useTranslation();
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{t('stockPage.title')}</h1>
            <StockOverviewDashboard />
        </div>
    );
};

export default StockPage;
