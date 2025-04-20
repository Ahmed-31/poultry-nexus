import React, {useEffect, useMemo, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import Modal from "@/src/components/common/Modal.jsx";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {fetchProducts, removeProduct} from "@/src/store/productsSlice.jsx";
import ItemFormModal from "@/src/components/Stock/ItemFormModal.jsx";
import DeleteConfirmationModal from "@/src/components/common/DeleteConfirmationModal.jsx";
import {toast} from "@/hooks/use-toast";

const ProductSelectorModal = ({showModal, onClose, action}) => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.list);
    const loading = useSelector((state) => state.products.loading);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredProducts = useMemo(() => {
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleProceed = () => {
        if (!selectedProduct) return;
        setActiveModal(action);
    };

    const handleDelete = async () => {
        try {
            await dispatch(removeProduct({id: selectedProduct.id})).unwrap();
            toast({
                title: t('global.toasts.success'),
                description: t('productSelector.success.delete'),
                variant: "default",
            });
            closeAll();
        } catch (err) {
            toast({
                title: t('global.toasts.error'),
                description: err.message || t('productSelector.error.delete'),
                variant: "destructive",
            });
            setActiveModal(null);
        }
    };

    const closeAll = () => {
        setActiveModal(null);
        setSelectedProduct(null);
        onClose();
    };

    return (
        <>
            <Modal isOpen={showModal && !activeModal} onClose={onClose}>
                <h2 className="text-lg font-semibold mb-4">{t('productSelector.title')}</h2>

                <Label>{t('productSelector.label.search')}</Label>
                <Input
                    className="my-2"
                    placeholder={t('productSelector.placeholder.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {loading && <p className="text-sm text-gray-500 my-2">{t('productSelector.loading')}</p>}

                {!loading && filteredProducts.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-auto">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className={`p-2 border rounded cursor-pointer ${
                                    selectedProduct?.id === product.id
                                        ? "border-blue-500 bg-blue-50"
                                        : ""
                                }`}
                            >
                                <div className="text-sm font-medium">{product.name}</div>
                                <div className="text-xs text-gray-500">
                                    {t('productSelector.productInfo', {
                                        sku: product.sku,
                                        type: product.type,
                                        price: product.price
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <p className="text-sm text-gray-500 mt-4">{t('productSelector.empty')}</p>
                )}

                <div className="flex justify-end mt-6 space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        {t('global.cancel')}
                    </Button>
                    <Button onClick={handleProceed} disabled={!selectedProduct}>
                        {t('global.continue')}
                    </Button>
                </div>
            </Modal>

            {activeModal === "editItem" && selectedProduct && (
                <ItemFormModal
                    showModal={true}
                    initialData={selectedProduct}
                    onClose={closeAll}
                />
            )}

            {activeModal === "removeItem" && selectedProduct && (
                <DeleteConfirmationModal
                    showModal={true}
                    entityName="Product"
                    entityId={selectedProduct.id}
                    onConfirm={handleDelete}
                    onCancel={() => setActiveModal(null)}
                />
            )}
        </>
    );
};

export default ProductSelectorModal;
