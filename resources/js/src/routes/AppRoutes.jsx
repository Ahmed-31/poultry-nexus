import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from '@/src/store/store';
import Layout from '@/src/layouts/Layout.jsx';
import StockPage from '@/src/pages/StockPage.jsx';
import NotFoundPage from '@/src/pages/NotFoundPage.jsx';
import HomePage from '@/src/pages/HomePage.jsx';
import OrderPage from "@/src/pages/OrderPage.jsx";
import Login from '@/src/pages/Login.jsx';
import Logout from '@/src/components/Auth/Logout.jsx';
import PrivateRoutes from './PrivateRoutes.jsx';
import PublicRoute from './PublicRoutes.jsx';
import {AuthProvider} from "@/src/context/AuthContext.jsx";
import OrderDetails from '@/src/components/Order/OrderDetails.jsx';
import {MenuProvider} from '@/src/context/MenuContext.jsx';
import StockList from '@/src/pages/StockList.jsx'
import StockLevelsMovements from "@/src/pages/StockLevelsMovements.jsx";
import WarehousesPage from "@/src/pages/WarehousesPage.jsx";
import ProductsPage from "@/src/pages/ProductsPage.jsx";
import StockScanPage from "@/src/pages/StockScanPage.jsx";
import ReservationList from "@/src/components/Order/ReservationList.jsx";
import UomPage from "@/src/pages/UomPage.jsx";
import CustomersPage from "@/src/pages/CustomersPage.jsx"

const AppRoutes = () => (
    <Provider store={store}>
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

                            <Route path="orders" element={<OrderPage/>}/>
                            <Route path="orders/:orderId" element={<OrderDetails/>}/>

                            <Route
                                path="stock/dashboard"
                                element={<StockPage/>}
                            />
                            <Route
                                path="stock/list"
                                element={<StockList/>}
                            />
                            <Route
                                path="stock/stock-movements"
                                element={<StockLevelsMovements/>}
                            />
                            <Route
                                path="stock/warehouses"
                                element={<WarehousesPage/>}
                            />
                            <Route
                                path="stock/products"
                                element={<ProductsPage/>}
                            />
                            <Route
                                path="stock/update-manual"
                                element={<StockScanPage/>}
                            />
                            <Route
                                path="/stock/reservations"
                                element={<ReservationList />}
                            />
                            <Route
                                path="/uom"
                                element={<UomPage />}
                            />
                            <Route
                                path="/sales-distribution/customers"
                                element={<CustomersPage />}
                            />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </AuthProvider>
        </Router>
    </Provider>
);

export default AppRoutes;
