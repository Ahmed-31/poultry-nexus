// resources/js/src/routes/AppRoutes.jsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from '../layouts/Layout.jsx';
import InventoryPage from '../pages/InventoryPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import OrderPage from "../pages/OrderPage.jsx";

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="/orders" element={<OrderPage/>}/>
                <Route path="inventory" element={<InventoryPage/>}/>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    </Router>
);

export default AppRoutes;
