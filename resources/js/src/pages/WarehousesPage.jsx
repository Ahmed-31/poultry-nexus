import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchWarehousesTable, removeWarehouse} from "../store/warehouseSlice";
import {FaPlus} from "react-icons/fa";
import {Button} from "@/Components/ui/button";
import DataTable from "react-data-table-component";
import WarehouseFormModal from "@/src/components/Stock/Warehouse/FormModals/WarehouseFormModal.jsx";
import {useTranslation} from "react-i18next";

const WarehouseManagement = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const warehouses = useSelector((state) => state.warehouses.dataTable || []);
    const loading = useSelector((state) => state.warehouses.loading);
    const currentLang = useSelector((state) => state.language.current);

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
        if (window.confirm(t('warehouseManagement.confirmDelete'))) {
            dispatch(removeWarehouse({id}))
                .unwrap()
                .then(() => dispatch(fetchWarehousesTable()))
                .catch((err) => {
                    console.error("Delete failed:", err);
                    alert(t('warehouseManagement.deleteFailed'));
                });
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditItem(null);
        dispatch(fetchWarehousesTable());
    };

    const columns = [
        {name: t('warehouseManagement.tableHeaders.name'), selector: (row) => row.name, sortable: true},
        {
            name: t('warehouseManagement.tableHeaders.location'),
            selector: (row) => row.location || t('global.na'),
            sortable: true
        },
        {
            name: t('warehouseManagement.tableHeaders.stock'),
            selector: (row) => row.totalQuantity,
            sortable: true,
            cell: (row) => (
                <div className="text-sm font-medium text-gray-700">
                    {t('warehouseManagement.unitsLabel', {
                        count: row.totalQuantity
                    })}
                </div>
            ),
        },
        {
            name: t('warehouseManagement.tableHeaders.actions'),
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>{t('global.edit')}</Button>
                    <Button variant="destructive" onClick={() => handleDelete(row.id)}>{t('global.delete')}</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            <div className="flex justify-between items-center px-8 py-6 gap-4 flex-wrap">
                <h2 className="text-3xl font-bold text-gray-800">🏢 {t('warehouseManagement.title')}</h2>
                <div className="flex gap-3">
                    <Button onClick={() => dispatch(fetchWarehousesTable())} variant="outline">
                        🔄 {t('global.refresh')}
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                    >
                        <FaPlus className="mr-2"/> {t('warehouseManagement.addWarehouse')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder={"🔍 " + t('warehouseManagement.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                />
            </div>

            <div className="text-right text-sm text-gray-500 px-8 pb-2">
                {t('warehouseManagement.showingResults', {
                    count: filteredWarehouses.length,
                    total: warehouses.length
                })}
            </div>

            <div className="w-full overflow-x-auto">
                <DataTable
                    key={currentLang}
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
                        {t('warehouseManagement.noMatch')}
                    </div>
                )}
            </div>

            {showForm && (
                <WarehouseFormModal showModal={showForm} onClose={handleCloseForm} initialData={editItem}/>
            )}
        </div>
    );
};

export default WarehouseManagement;
