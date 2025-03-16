import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchInventory} from "../../store/inventorySlice";
import {fetchStockMovements} from "../../store/stockMovementsSlice";
import {fetchWarehouses} from "../../store/warehouseSlice";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend} from "recharts";
import {FaBox, FaWarehouse, FaExclamationTriangle, FaChartLine} from "react-icons/fa";

const StockOverviewDashboard = () => {
    const dispatch = useDispatch();

    // Fetch inventory, stock movements, and warehouses
    const inventory = useSelector((state) => state.inventory.items || []);
    const stockMovements = useSelector((state) => state.stockMovements.items || []);
    const warehouses = useSelector((state) => state.warehouses.items || []);
    const loading = useSelector((state) => state.inventory.loading || state.stockMovements.loading);

    // Fetch data on page load
    useEffect(() => {
        dispatch(fetchInventory());
        dispatch(fetchStockMovements());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    // ✅ Stock movement trends (Last 7 Days)
    const stockTrendData = useMemo(() => stockMovements.slice(-7).map((movement) => ({
        name: new Date(movement.movement_date).toLocaleDateString(),
        quantity: movement.quantity,
        type: movement.movement_type,
    })), [stockMovements]);

    // ✅ Warehouse Capacity Data (Used vs Available Space)
    const warehouseCapacityData = useMemo(() => warehouses.map((warehouse) => ({
        name: warehouse.name,
        used: inventory.filter((item) => item.warehouse.id === warehouse.id).reduce((sum, item) => sum + item.quantity, 0),
        capacity: warehouse.maximum_capacity || 1000, // Default to 1000 if not set
    })), [warehouses, inventory]);

    // ✅ Low Stock Alerts (Products below minimum stock level)
    const lowStockItems = useMemo(() => inventory.filter(item => item.quantity < item.minimum_stock_level), [inventory]);

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-3xl font-semibold mb-6">📊 Stock Overview Dashboard</h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-100 rounded shadow flex items-center space-x-3">
                    <FaBox className="text-blue-500 text-3xl"/>
                    <div>
                        <h3 className="text-xl font-bold">Total Products</h3>
                        <p className="text-2xl">{inventory.length}</p>
                    </div>
                </div>
                <div className="p-4 bg-green-100 rounded shadow flex items-center space-x-3">
                    <FaWarehouse className="text-green-500 text-3xl"/>
                    <div>
                        <h3 className="text-xl font-bold">Total Stock</h3>
                        <p className="text-2xl">{inventory.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    </div>
                </div>
                <div className="p-4 bg-red-100 rounded shadow flex items-center space-x-3">
                    <FaExclamationTriangle className="text-red-500 text-3xl"/>
                    <div>
                        <h3 className="text-xl font-bold">Low Stock Alerts</h3>
                        <p className="text-2xl">{lowStockItems.length}</p>
                    </div>
                </div>
            </div>

            {/* Stock Movement Trends */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">📈 Stock Movement Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stockTrendData}>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="quantity" fill="#82ca9d"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Warehouse Capacity Overview */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">🏢 Warehouse Capacity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={warehouseCapacityData} dataKey="used" nameKey="name" cx="50%" cy="50%"
                             outerRadius={120} fill="#8884d8">
                            {warehouseCapacityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-4">🚨 Low Stock Alerts</h3>
                    <div className="bg-red-100 p-4 rounded shadow">
                        <ul className="list-disc list-inside">
                            {lowStockItems.map((item) => (
                                <li key={item.id}>
                                    <strong>{item.product.name}</strong> in {item.warehouse.name} is low
                                    ({item.quantity} left).
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockOverviewDashboard;
