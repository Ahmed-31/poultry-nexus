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
import PublicRoute from './PublicRoutes.jsx';
import {AuthProvider} from "../context/AuthContext.jsx";
import {OrderProvider} from "../context/OrderContext.jsx";
import {InventoryProvider} from "../context/InventoryContext.jsx";
import OrderDetails from '../components/Order/OrderDetails.jsx';
import {MenuProvider} from '../context/MenuContext.jsx';

const AppRoutes = () => (
    <Router>
        <AuthProvider>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login/>
                        </PublicRoute>
                    }
                />

                <Route element={<PrivateRoutes/>}>
                    <Route path="/" element={<MenuProvider> <Layout/> </MenuProvider>}>
                        <Route path="/logout" element={<Logout/>}/>
                        <Route index element={<HomePage/>}/>

                        <Route path="orders" element={<OrderProvider> <OrderPage/> </OrderProvider>}/>
                        <Route path="orders/:orderId" element={<OrderProvider> <OrderDetails/> </OrderProvider>}/>

                        <Route
                            path="inventory"
                            element={
                                <InventoryProvider>
                                    <InventoryPage/>
                                </InventoryProvider>
                            }
                        />
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </AuthProvider>
    </Router>
);

export default AppRoutes;
