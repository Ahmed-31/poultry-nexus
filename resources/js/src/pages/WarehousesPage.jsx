import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchWarehousesTable, removeWarehouse} from "../store/warehouseSlice";
import {FaPlus} from "react-icons/fa";
import {Button} from "@/Components/ui/button";
import DataTable from "react-data-table-component";
import WarehouseFormModal from "@/src/components/Stock/WarehouseFormModal.jsx";

const WarehouseManagement = () => {
    const dispatch = useDispatch();

    const warehouses = useSelector((state) => state.warehouses.dataTable || []);
    const loading = useSelector((state) => state.warehouses.loading);

    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        dispatch(fetchWarehousesTable());
    }, [dispatch]);

    const enrichedWarehouses = useMemo(() => {
        return warehouses.map((warehouse) => {
            const totalQuantity = (warehouse.stocks || []).reduce((sum, stock) => sum + stock.quantity_in_base, 0);
            return {
                ...warehouse,
                totalQuantity,
            };
        });
    }, [warehouses]);

    const filteredWarehouses = useMemo(() => {
        return enrichedWarehouses.filter((warehouse) =>
            warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (warehouse.location && warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, enrichedWarehouses]);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this warehouse?")) {
            dispatch(removeWarehouse({id}))
                .unwrap()
                .then(() => dispatch(fetchWarehousesTable()))
                .catch((err) => {
                    console.error("Delete failed:", err);
                    alert("Something went wrong while deleting.");
                });
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditItem(null);
        dispatch(fetchWarehousesTable());
    };

    const columns = [
        {name: "Warehouse Name", selector: (row) => row.name, sortable: true},
        {name: "Location", selector: (row) => row.location || "N/A", sortable: true},
        {
            name: "Total Stock",
            selector: (row) => row.totalQuantity,
            sortable: true,
            cell: (row) => (
                <div className="text-sm font-medium text-gray-700">
                    {row.totalQuantity} units
                </div>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(row.id)}>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            <div className="flex justify-between items-center px-8 py-6 gap-4 flex-wrap">
                <h2 className="text-3xl font-bold text-gray-800">🏢 Warehouse Management</h2>
                <div className="flex gap-3">
                    <Button onClick={() => dispatch(fetchWarehousesTable())} variant="outline">
                        🔄 Refresh
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                    >
                        <FaPlus className="mr-2"/> Add Warehouse
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder="🔍 Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                />
            </div>

            <div className="text-right text-sm text-gray-500 px-8 pb-2">
                Showing {filteredWarehouses.length} of {warehouses.length} warehouses
            </div>

            <div className="w-full overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={filteredWarehouses}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    striped
                    className="border rounded-none shadow-sm w-full"
                />
                {!loading && filteredWarehouses.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        No warehouses found matching your search.
                    </div>
                )}
            </div>

            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                    <div
                        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 transform transition-all">
                        <WarehouseFormModal showModal={showForm} onClose={handleCloseForm} initialData={editItem}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarehouseManagement;
