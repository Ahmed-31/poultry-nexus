import React, {useEffect, useMemo, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import Modal from "@/src/components/common/Modal.jsx";
import {Input} from "@/Components/ui/input.jsx";
import {Button} from "@/Components/ui/button.jsx";
import {Label} from "@/Components/ui/label.jsx";
import {fetchWarehouses, removeWarehouse} from "@/src/store/warehouseSlice.jsx";
import WarehouseFormModal from "@/src/components/Stock/Warehouse/FormModals/WarehouseFormModal.jsx";
import DeleteConfirmationModal from "@/src/components/common/DeleteConfirmationModal.jsx";
import {toast} from "@/hooks/use-toast.js";
import {useTranslation} from "react-i18next";

const WarehouseSelectorModal = ({showModal, onClose, action}) => {
    const {t} = useTranslation();
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
            (w.name || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                title: t('global.toasts.successTitle'),
                description: t('warehouseSelector.toast.successMessage'),
                variant: "default",
            });
            closeAll();
        } catch (err) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: err.message || t('global.toasts.errorMessage'),
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
                <h2 className="text-lg font-semibold mb-4">{t('warehouseSelector.title')}</h2>

                <Label>{t('warehouseSelector.searchLabel')}</Label>
                <Input
                    className="my-2"
                    placeholder={t('warehouseSelector.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {loading && <p className="text-sm text-gray-500 my-2">{t('warehouseSelector.loading')}</p>}

                {!loading && filteredWarehouses.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-auto">
                        {filteredWarehouses.map((warehouse) => {
                            if (!warehouse?.id) return null;

                            return (
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
                                        {t('warehouseSelector.location')}: {warehouse.location || t('global.na')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredWarehouses.length === 0 && (
                    <p className="text-sm text-gray-500 mt-4">{t('warehouseSelector.noMatch')}</p>
                )}

                <div className="flex justify-end mt-6 space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        {t('global.cancel')}
                    </Button>
                    <Button onClick={handleProceed} disabled={!selectedWarehouse}>
                        {action === "editWarehouse" ? t('global.edit') : t('global.delete')}
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
