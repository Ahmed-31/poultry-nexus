import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchInventory} from "../store/inventorySlice";
import {fetchProducts} from "../store/productsSlice";
import {fetchWarehouses} from "../store/warehouseSlice";
import DataTable from "react-data-table-component";
import Button from "../components/common/Button";
import {FaPlus, FaTrash, FaEdit, FaFilter} from "react-icons/fa";

const InventoryList = () => {
    const dispatch = useDispatch();

    // Fetch inventory, products, and warehouses from Redux store
    const inventory = useSelector((state) => state.inventory.items || []);
    const products = useSelector((state) => state.products.list || []);
    const warehouses = useSelector((state) => state.warehouses.items || []);
    const loading = useSelector((state) => state.inventory.loading);

    // State for filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [stockFilter, setStockFilter] = useState("");

    // Fetch data when the page loads
    useEffect(() => {
        dispatch(fetchInventory());
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    // ✅ Filter inventory list
    const filteredInventory = useMemo(() => {
        return inventory
            .filter((item) =>
                item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((item) => (selectedWarehouse ? item.warehouse.id === selectedWarehouse : true))
            .filter((item) =>
                stockFilter === "low"
                    ? item.quantity < item.minimum_stock_level
                    : stockFilter === "high"
                        ? item.quantity > item.minimum_stock_level
                        : true
            );
    }, [inventory, searchTerm, selectedWarehouse, stockFilter]);

    // Define table columns
    const columns = [
        {name: "Product", selector: (row) => row.product.name, sortable: true},
        {name: "Warehouse", selector: (row) => row.warehouse.name, sortable: true},
        {name: "Available Stock", selector: (row) => row.quantity, sortable: true},
        {
            name: "Stock Status",
            selector: (row) => row.quantity < row.minimum_stock_level ? "Low Stock" : "Sufficient",
            sortable: true,
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded text-white ${
                        row.quantity < row.minimum_stock_level ? "bg-red-500" : "bg-green-500"
                    }`}
                >
                    {row.quantity < row.minimum_stock_level ? "Low Stock" : "Sufficient"}
                </span>
            ),
        },
        {name: "Reserved", selector: (row) => row.reserved_quantity, sortable: true},
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => console.log("Edit", row.id)}>
                        <FaEdit className="mr-1"/> Edit
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">📦 Inventory Management</h2>
                <Button variant="primary" onClick={() => console.log("Open Add Inventory Form")}>
                    <FaPlus className="mr-2"/> Add Inventory Item
                </Button>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
                <input
                    type="text"
                    placeholder="🔍 Search product or warehouse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                />

                <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Warehouses</option>
                    {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                        </option>
                    ))}
                </select>

                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Stock Levels</option>
                    <option value="low">Low Stock</option>
                    <option value="high">High Stock</option>
                </select>
            </div>

            {/* Inventory Table */}
            <DataTable
                columns={columns}
                data={filteredInventory}
                progressPending={loading}
                pagination
                highlightOnHover
                striped
            />
        </div>
    );
};

export default InventoryList;
