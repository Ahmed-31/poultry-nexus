import React, {useEffect, useMemo, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import Modal from "@/src/components/common/Modal.jsx";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {fetchWarehouses, removeWarehouse} from "@/src/store/warehouseSlice.jsx";
import WarehouseFormModal from "@/src/components/Stock/WarehouseFormModal.jsx";
import DeleteConfirmationModal from "@/src/components/common/DeleteConfirmationModal.jsx";
import {toast} from "@/hooks/use-toast";

const WarehouseSelectorModal = ({showModal, onClose, action}) => {
    const dispatch = useDispatch();
    const warehouses = useSelector((state) => state.warehouses.list || []);
    const loading = useSelector((state) => state.warehouses.loading);

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        dispatch(fetchWarehouses());
    }, [dispatch]);

    const filteredWarehouses = useMemo(() => {
        return warehouses.filter((w) =>
            w.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [warehouses, searchTerm]);

    const handleProceed = () => {
        if (!selectedWarehouse) return;
        setActiveModal(action);
    };

    const handleDelete = async () => {
        try {
            await dispatch(removeWarehouse({id: selectedWarehouse.id})).unwrap();
            toast({
                title: "Success",
                description: "Warehouse deleted successfully.",
                variant: "default",
            });
            closeAll();
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to delete the warehouse.",
                variant: "destructive",
            });
            setActiveModal(null);
        }
    };

    const closeAll = () => {
        setActiveModal(null);
        setSelectedWarehouse(null);
        onClose();
    };

    return (
        <>
            <Modal isOpen={showModal && !activeModal} onClose={onClose}>
                <h2 className="text-lg font-semibold mb-4">Select Warehouse</h2>

                <Label>Search by name</Label>
                <Input
                    className="my-2"
                    placeholder="Search warehouses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {loading && <p className="text-sm text-gray-500 my-2">Loading warehouses...</p>}

                {!loading && filteredWarehouses.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-auto">
                        {filteredWarehouses.map((warehouse) => (
                            <div
                                key={warehouse.id}
                                onClick={() => setSelectedWarehouse(warehouse)}
                                className={`p-2 border rounded cursor-pointer ${
                                    selectedWarehouse?.id === warehouse.id
                                        ? "border-blue-500 bg-blue-50"
                                        : ""
                                }`}
                            >
                                <div className="text-sm font-medium">{warehouse.name}</div>
                                <div className="text-xs text-gray-500">
                                    Location: {warehouse.location || "N/A"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredWarehouses.length === 0 && (
                    <p className="text-sm text-gray-500 mt-4">No matching warehouses found.</p>
                )}

                <div className="flex justify-end mt-6 space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleProceed} disabled={!selectedWarehouse}>
                        {action === "editWarehouse" ? "Edit" : "Delete"}
                    </Button>
                </div>
            </Modal>

            {activeModal === "editWarehouse" && selectedWarehouse && (
                <WarehouseFormModal
                    showModal={true}
                    initialData={selectedWarehouse}
                    onClose={() => {
                        dispatch(fetchWarehouses());
                        closeAll();
                    }}
                />
            )}

            {activeModal === "removeWarehouse" && selectedWarehouse && (
                <DeleteConfirmationModal
                    showModal={true}
                    entityName="Warehouse"
                    entityId={selectedWarehouse.id}
                    onConfirm={handleDelete}
                    onCancel={() => setActiveModal(null)}
                />
            )}
        </>
    );
};

export default WarehouseSelectorModal;
