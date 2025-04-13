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
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [stockFilter, setStockFilter] = useState("");

    useEffect(() => {
        dispatch(fetchStockTable());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    const filteredStock = useMemo(() => {
        return stock
            .filter((item) =>
                item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((item) => (selectedWarehouse ? item.warehouse.id === selectedWarehouse : true));
    }, [stock, searchTerm, selectedWarehouse, stockFilter]);

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
            sortable: true
        },
        {
            name: "Warehouse",
            selector: (row) => row.warehouse?.name ?? "-",
            sortable: true
        },
        {
            name: "Amount",
            selector: (row) => row.amount,
            sortable: true
        },
        {
            name: "Unit of Measure",
            selector: (row) => row.unit ?? "-",
            sortable: true
        },
        {
            name: "Dimensions",
            selector: (row) => row.dimensions,
            sortable: false
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>
                        <FaEdit className="mr-1"/> Edit
                    </Button>
                </div>
            )
        }
    ];


    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            <div className="flex justify-between items-center px-8 py-6">
                <h2 className="text-4xl font-bold text-gray-800">📦 Stock Management</h2>
                <Button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                >
                    <FaPlus className="mr-2"/> Add Stock Item
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder="🔍 Search product or warehouse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                />

                <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
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
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                >
                    <option value="">All Stock Levels</option>
                    <option value="low">Low Stock</option>
                    <option value="high">High Stock</option>
                </select>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="w-full">
                    <DataTable
                        columns={columns}
                        data={filteredStock}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        className="border rounded-lg shadow-sm w-full"
                    />
                </div>
            </div>

            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                    <div
                        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 transform transition-all">
                        <StockFormModal showModal={showForm} onClose={handleCloseForm} initialData={editItem}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockList;
