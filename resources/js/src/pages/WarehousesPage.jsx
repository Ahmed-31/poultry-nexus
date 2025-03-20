import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchWarehousesTable} from "../store/warehouseSlice";
import {fetchInventory} from "../store/inventorySlice";
import DataTable from "react-data-table-component";
import Button from "../components/common/Button";
import {FaPlus, FaEdit} from "react-icons/fa";
import WarehouseForm from "@/src/components/Inventory/WarehouseForm.jsx";

const WarehouseManagement = () => {
    const dispatch = useDispatch();

    // Fetch warehouses and inventory from Redux store
    const warehouses = useSelector((state) => state.warehouses.dataTable || []);
    const inventory = useSelector((state) => state.inventory.items || []);
    const loading = useSelector((state) => state.warehouses.loading);

    // State for filters
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // Fetch data when the page loads
    useEffect(() => {
        dispatch(fetchWarehousesTable());
        dispatch(fetchInventory());
    }, [dispatch]);

    // ✅ Calculate warehouse stock usage
    const warehouseStockUsage = useMemo(() => {
        return warehouses.map((warehouse) => ({
            ...warehouse,
            usedCapacity: inventory
                .filter((item) => item.warehouse.id === warehouse.id)
                .reduce((sum, item) => sum + item.quantity, 0),
        }));
    }, [warehouses, inventory]);

    // ✅ Filtered warehouse list
    const filteredWarehouses = useMemo(() => {
        return warehouseStockUsage.filter((warehouse) =>
            warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (warehouse.location && warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [warehouseStockUsage, searchTerm]);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditItem(null);
    };

    // Define table columns
    const columns = [
        {name: "Warehouse Name", selector: (row) => row.name, sortable: true},
        {name: "Location", selector: (row) => row.location || "N/A", sortable: true},
        {
            name: "Used Capacity",
            selector: (row) => row.usedCapacity,
            sortable: true,
            cell: (row) => (
                <div className="w-full h-5 bg-gray-200 rounded-md overflow-hidden">
                    <div
                        className="h-full bg-blue-500 text-xs text-white flex items-center justify-center"
                        style={{width: `${(row.usedCapacity / (row.maximum_capacity || 1000)) * 100}%`}}
                    >
                        {row.usedCapacity}
                    </div>
                </div>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>Edit</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            <div className="flex justify-between items-center px-8 py-6">
                <h2 className="text-4xl font-bold text-gray-800">🏢 Warehouse Management</h2>
                <Button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                >
                    <FaPlus className="mr-2"/> Add Warehouse
                </Button>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder="🔍 Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full~"
                />
            </div>

            {/* Warehouse Table */}
            <div className="w-full overflow-x-auto">
                <div className="w-full">
                    <DataTable
                        columns={columns}
                        data={filteredWarehouses}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        className="border rounded-none shadow-sm w-full"
                    />
                </div>
            </div>

            {/* Modal for Product Form */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                    <div
                        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 transform transition-all">
                        <WarehouseForm onClose={handleCloseForm} initialData={editItem}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarehouseManagement;
