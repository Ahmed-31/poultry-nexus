import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchWarehousesTable, fetchWarehouses} from "../store/warehouseSlice";
import {fetchInventory} from "../store/inventorySlice";
import DataTable from "react-data-table-component";
import Button from "../components/common/Button";
import {FaPlus, FaEdit} from "react-icons/fa";

const WarehouseManagement = () => {
    const dispatch = useDispatch();

    // Fetch warehouses and inventory from Redux store
    const warehouses = useSelector((state) => state.warehouses.dataTable || []);
    const inventory = useSelector((state) => state.inventory.items || []);
    const loading = useSelector((state) => state.warehouses.loading);

    // State for filters
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch data when the page loads
    useEffect(() => {
        dispatch(fetchWarehousesTable());
        // dispatch(fetchWarehouses());
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

    // Define table columns
    const columns = [
        {name: "Warehouse Name", selector: (row) => row.name, sortable: true},
        {name: "Location", selector: (row) => row.location || "N/A", sortable: true},
        {name: "Capacity", selector: (row) => row.maximum_capacity || "N/A", sortable: true},
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
                <h2 className="text-3xl font-semibold">🏢 Warehouse Management</h2>
                <Button variant="primary" onClick={() => console.log("Open Add Warehouse Form")}>
                    <FaPlus className="mr-2"/> Add Warehouse
                </Button>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
                <input
                    type="text"
                    placeholder="🔍 Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Warehouse Table */}
            <DataTable
                columns={columns}
                data={filteredWarehouses}
                progressPending={loading}
                pagination
                highlightOnHover
                striped
            />
        </div>
    );
};

export default WarehouseManagement;
