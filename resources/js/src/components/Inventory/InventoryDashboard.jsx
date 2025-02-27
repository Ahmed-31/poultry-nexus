import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchInventory} from "../../store/inventorySlice";
import {fetchProducts} from "../../store/productsSlice";
import {fetchWarehouses} from "../../store/warehouseSlice";
import {fetchStockMovements} from "../../store/stockMovementsSlice";
import DataTable from "react-data-table-component";
import Button from "../common/Button";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend} from "recharts";
import {FaBox, FaWarehouse, FaExclamationTriangle, FaSearch} from "react-icons/fa";

const InventoryDashboard = () => {
    const dispatch = useDispatch();

    // Fetch data from Redux store
    const inventory = useSelector((state) => state.inventory.items || []);
    const stockMovements = useSelector((state) => state.stockMovements.items || []);
    const warehouses = useSelector((state) => state.warehouses.items || []);
    const loading = useSelector((state) => state.inventory.loading);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("product.name");
    const [sortOrder, setSortOrder] = useState("asc");

    // Fetch all data on page load
    useEffect(() => {
        dispatch(fetchInventory());
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
        dispatch(fetchStockMovements());
    }, [dispatch]);

    // ✅ Memoize filtered inventory to improve performance
    const filteredInventory = useMemo(() => {
        return inventory
            .filter((item) =>
                item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const fieldA = a.product.name.toLowerCase();
                const fieldB = b.product.name.toLowerCase();
                return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
            });
    }, [inventory, searchTerm, sortField, sortOrder]);

    // Table columns for inventory
    const inventoryColumns = [
        {name: "Product", selector: (row) => row.product.name, sortable: true},
        {name: "Warehouse", selector: (row) => row.warehouse.name, sortable: true},
        {name: "Available Stock", selector: (row) => row.quantity, sortable: true},
        {name: "Reserved Stock", selector: (row) => row.reserved_quantity, sortable: true},
        {name: "Min Stock Level", selector: (row) => row.minimum_stock_level, sortable: true},
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="primary" onClick={() => console.log("View Movements", row.id)}>View</Button>
                    <Button variant="warning" onClick={() => console.log("Edit", row.id)}>Edit</Button>
                </div>
            ),
        },
    ];

    // Stock Trends Chart Data (Last 7 Days)
    const stockTrendData = useMemo(() => stockMovements.slice(-7).map((movement) => ({
        name: new Date(movement.movement_date).toLocaleDateString(),
        quantity: movement.quantity,
        type: movement.movement_type,
    })), [stockMovements]);

    // Warehouse Capacity Pie Chart
    const warehouseCapacityData = useMemo(() => warehouses.map((warehouse) => ({
        name: warehouse.name,
        used: inventory.filter((item) => item.warehouse.id === warehouse.id).reduce((sum, item) => sum + item.quantity, 0),
        capacity: warehouse.maximum_capacity || 1000, // Assume 1000 if not set
    })), [warehouses, inventory]);

    return (
        <div className="p-6 bg-gray-100 rounded shadow-md">
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
                        <p className="text-2xl">{inventory.filter((item) => item.quantity < item.minimum_stock_level).length}</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex items-center space-x-2">
                <FaSearch className="text-gray-500 text-xl"/>
                <input
                    type="text"
                    placeholder="🔍 Search by product or warehouse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Inventory Table */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">Stock Overview</h3>
                <DataTable
                    columns={inventoryColumns}
                    data={filteredInventory}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    striped
                />
            </div>

            {/* Stock Movements Chart */}
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

            {/* Warehouse Capacity Pie Chart */}
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
        </div>
    );
};

export default InventoryDashboard;
