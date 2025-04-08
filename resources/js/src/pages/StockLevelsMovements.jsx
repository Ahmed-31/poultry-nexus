import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchInventory} from "../store/inventorySlice";
import {fetchStockMovements} from "../store/stockMovementsSlice";
import {fetchProducts} from "../store/productsSlice";
import {fetchWarehouses} from "../store/warehouseSlice";
import DataTable from "react-data-table-component";
import {FaFilter, FaSync, FaChartLine} from "react-icons/fa";

const StockLevelsMovements = () => {
    const dispatch = useDispatch();

    const inventory = useSelector((state) => state.inventory.items || []);
    const stockMovements = useSelector((state) => state.stockMovements.items || []);
    const products = useSelector((state) => state.products.list || []);
    const warehouses = useSelector((state) => state.warehouses.items || []);
    const loading = useSelector((state) => state.inventory.loading || state.stockMovements.loading);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [dateRange, setDateRange] = useState({start: "", end: ""});

    useEffect(() => {
        dispatch(fetchInventory());
        dispatch(fetchStockMovements());
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    const filteredInventory = useMemo(() => {
        return inventory
            .filter((item) =>
                item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((item) => (selectedProduct ? item.product.id === selectedProduct : true))
            .filter((item) => (selectedWarehouse ? item.warehouse.id === selectedWarehouse : true));
    }, [inventory, searchTerm, selectedProduct, selectedWarehouse]);

    const filteredStockMovements = useMemo(() => {
        return stockMovements
            .filter((movement) =>
                movement.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movement.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((movement) => (selectedProduct ? movement.product.id === selectedProduct : true))
            .filter((movement) => (selectedWarehouse ? movement.warehouse.id === selectedWarehouse : true))
            .filter((movement) =>
                dateRange.start && dateRange.end
                    ? new Date(movement.movement_date) >= new Date(dateRange.start) &&
                    new Date(movement.movement_date) <= new Date(dateRange.end)
                    : true
            );
    }, [stockMovements, searchTerm, selectedProduct, selectedWarehouse, dateRange]);

    const stockColumns = [
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
    ];

    const movementColumns = [
        {name: "Date", selector: (row) => new Date(row.movement_date).toLocaleDateString(), sortable: true},
        {name: "Product", selector: (row) => row.product.name, sortable: true},
        {name: "Warehouse", selector: (row) => row.warehouse.name, sortable: true},
        {name: "Quantity", selector: (row) => row.quantity, sortable: true},
        {
            name: "Type",
            selector: (row) => row.movement_type,
            sortable: true,
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded text-white ${
                        row.movement_type === "inbound" ? "bg-green-500" :
                            row.movement_type === "outbound" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                >
                    {row.movement_type}
                </span>
            ),
        },
        {name: "Reason", selector: (row) => row.reason || "N/A"},
    ];

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-3xl font-semibold mb-6">📦 Stock Levels & Movements</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
                <input type="text" placeholder="🔍 Search by product or warehouse..."
                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                       className="p-2 border border-gray-300 rounded-lg"/>

                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg">
                    <option value="">All Products</option>
                    {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>

                <select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg">
                    <option value="">All Warehouses</option>
                    {warehouses.map((warehouse) => <option key={warehouse.id}
                                                           value={warehouse.id}>{warehouse.name}</option>)}
                </select>
            </div>

            <h3 className="text-2xl font-semibold mb-4">📋 Stock Levels</h3>
            <DataTable columns={stockColumns} data={filteredInventory} pagination highlightOnHover striped/>

            <h3 className="text-2xl font-semibold mt-6 mb-4">🔄 Stock Movements</h3>
            <DataTable columns={movementColumns} data={filteredStockMovements} pagination highlightOnHover striped/>
        </div>
    );
};

export default StockLevelsMovements;
