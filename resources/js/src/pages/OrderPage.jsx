import React from 'react';
import OrderList from '@/src/components/Order/OrderList.jsx';
import {useTranslation} from "react-i18next";

const OrderPage = () => {
    const {t} = useTranslation();
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{t('ordersPage.title')}</h1>
            <OrderList />
        </div>
    );
};

export default OrderPage;
