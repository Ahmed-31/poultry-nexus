// resources/js/src/routes/AppRoutes.jsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from '../layouts/Layout.jsx';
import InventoryPage from '../pages/InventoryPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import OrderPage from "../pages/OrderPage.jsx";
import Login from '../pages/Login.jsx';
import Logout from '../components/Auth/Logout.jsx';
import PrivateRoutes from './PrivateRoutes.jsx';
import {AuthProvider} from "../context/AuthContext.jsx";
import AuthenticatedProviders from '../context/AuthenticatedProviders.jsx';

const AppRoutes = () => (
    <Router>
        <AuthProvider>
            <AuthenticatedProviders>
                <Routes>
                    <Route path="/login" element={<Login/>}/>

                    <Route element={<PrivateRoutes/>}>
                        <Route path="/" element={<Layout/>}>
                            <Route path="/logout" element={<Logout/>}/>
                            <Route index element={<HomePage/>}/>
                            <Route path="orders" element={<OrderPage/>}/>
                            <Route path="inventory" element={<InventoryPage/>}/>
                        </Route>
                    </Route>

                    {/* 404 Page */}
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </AuthenticatedProviders>
        </AuthProvider>
    </Router>
);

export default AppRoutes;
