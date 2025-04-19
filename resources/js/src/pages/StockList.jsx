import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchStockTable} from "@/src/store/stockSlice";
import {fetchWarehouses} from "@/src/store/warehouseSlice";
import DataTable from "react-data-table-component";
import {Button} from "@/Components/ui/button";
import {FaPlus, FaEdit} from "react-icons/fa";
import StockFormModal from "@/src/components/Stock/StockFormModal.jsx";

const StockList = () => {
    const dispatch = useDispatch();

    const stock = useSelector((state) => state.stock.dataTable || []);
    const warehouses = useSelector((state) => state.warehouses.list || []);
    const loading = useSelector((state) => state.stock.loading);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [stockLevel, setStockLevel] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        dispatch(fetchStockTable());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    const filteredStock = useMemo(() => {
        return stock
            .filter((item) => {
                const productName = item.product?.name?.toLowerCase() || "";
                const warehouseName = item.warehouse?.name?.toLowerCase() || "";
                return (
                    productName.includes(searchTerm.toLowerCase()) ||
                    warehouseName.includes(searchTerm.toLowerCase())
                );
            })
            .filter((item) => {
                if (!selectedWarehouse) return true;
                return item.warehouse?.id?.toString() === selectedWarehouse;
            })
            .filter((item) => {
                if (!stockLevel) return true;
                const isLow = item.amount < (item.minimum_stock_level || 0);
                return stockLevel === "low" ? isLow : !isLow;
            });
    }, [stock, searchTerm, selectedWarehouse, stockLevel]);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditItem(null);
        dispatch(fetchStockTable());
    };

    const columns = [
        {
            name: "Product",
            selector: (row) => row.product?.name ?? "-",
            sortable: true,
            grow: 2,
        },
        {
            name: "Warehouse",
            selector: (row) => row.warehouse?.name ?? "-",
            sortable: true,
            grow: 2,
        },
        {
            name: "Amount",
            selector: (row) => row.amount,
            sortable: true,
            right: "true",
        },
        {
            name: "Unit",
            selector: (row) => row.unit ?? "-",
            sortable: true,
        },
        {
            name: "Dimensions",
            selector: (row) => row.dimensions || "-",
            sortable: false,
            grow: 2,
        },
        {
            name: "Actions",
            cell: (row) => (
                <Button variant="warning" onClick={() => handleEdit(row)} className="flex items-center gap-1">
                    <FaEdit/> Edit
                </Button>
            ),
            ignoreRowClick: true,
            allowoverflow: true,
            button: "true",
        },
    ];


    return (
        <div className="bg-white rounded-2xl shadow-lg w-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center px-8 py-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    📦 Stock Management
                </h2>
                <div className="flex gap-2">
                    <Button onClick={() => dispatch(fetchStockTable())} variant="outline">
                        🔄 Refresh
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-all"
                    >
                        <FaPlus/> Add Stock Item
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-8">
                <input
                    type="text"
                    placeholder="🔍 Search product or warehouse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                />

                <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Warehouses</option>
                    {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                        </option>
                    ))}
                </select>

                <select
                    value={stockLevel}
                    onChange={(e) => setStockLevel(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Stock Levels</option>
                    <option value="low">Low Stock</option>
                    <option value="high">Sufficient Stock</option>
                </select>
            </div>

            {/* Table */}
            <div className="px-8 pb-8">
                <DataTable
                    columns={columns}
                    data={filteredStock}
                    progressPending={loading}
                    pagination
                    striped
                    highlightOnHover
                    responsive
                    persistTableHead
                    className="rounded-lg border shadow-sm"
                />
            </div>

            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                        <StockFormModal showModal={showForm} onClose={handleCloseForm} initialData={editItem}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockList;
