import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/Components/ui/select.jsx";
import {Button} from "@/Components/ui/button.jsx";
import {Label} from "@/Components/ui/label.jsx";
import Modal from "@/src/components/common/Modal.jsx";
import {fetchMatchingStocks} from "@/src/services/stockService.jsx";
import {toast} from "@/hooks/use-toast.js";
import {fetchProducts} from "@/src/store/productsSlice.jsx";
import {fetchWarehouses} from "@/src/store/warehouseSlice.jsx";
import IssueStockFormModal from "@/src/components/Stock/Items/FormModals/IssueStockFormModal.jsx";
import TransferStockFormModal from "@/src/components/Stock/Items/FormModals/TransferStockFormModal.jsx";
import AdjustStockFormModal from "@/src/components/Stock/Items/FormModals/AdjustStockFormModal.jsx";
import StockCountModal from "@/src/components/Stock/Items/FormModals/StockCountModal.jsx";
import {useTranslation} from "react-i18next";

const StockSelectorModal = ({showModal, onClose, action}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.list);
    const warehouses = useSelector((state) => state.warehouses.list);
    const productLoading = useSelector((state) => state.products.loading);
    const warehouseLoading = useSelector((state) => state.warehouses.loading);

    const [productId, setProductId] = useState(null);
    const [warehouseId, setWarehouseId] = useState(null);
    const [matchingStocks, setMatchingStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [loadingStocks, setLoadingStocks] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    useEffect(() => {
        if (productId && warehouseId) {
            setLoadingStocks(true);
            fetchMatchingStocks(productId, warehouseId)
                .then((res) => setMatchingStocks(res))
                .catch(() => {
                    toast({
                        title: t('global.toasts.errorTitle'),
                        description: t('stockSelector.toast.stockLoadError'),
                        variant: "destructive",
                    });
                })
                .finally(() => setLoadingStocks(false));
        }
    }, [productId, warehouseId]);

    useEffect(() => {
        if (!loadingStocks && matchingStocks.length === 1) {
            setSelectedStock(matchingStocks[0]);
        }
    }, [loadingStocks, matchingStocks]);

    const handleProceed = () => {
        if (!selectedStock) return;
        setActiveModal(action);
    };

    const closeAll = () => {
        setActiveModal(null);
        setSelectedStock(null);
        onClose();
    };

    return (
        <>
            <Modal isOpen={showModal && !activeModal} onClose={onClose}>
                <h2 className="text-lg font-semibold mb-4">{t('stockSelector.title')}</h2>

                <Label className="mt-4">{t('stockSelector.warehouseLabel')}</Label>
                {warehouseLoading ? (
                    <p className="text-sm text-gray-500 my-2">{t('stockSelector.loadingWarehouses')}</p>
                ) : (
                    <Select
                        value={warehouseId}
                        onValueChange={(val) => setWarehouseId(val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('stockSelector.selectWarehouse')}/>
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map((w) => (
                                <SelectItem key={w.id} value={w.id.toString()}>
                                    {w.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <Label>{t('stockSelector.productLabel')}</Label>
                {productLoading ? (
                    <p className="text-sm text-gray-500 my-2">{t('stockSelector.loadingProducts')}</p>
                ) : (
                    <Select
                        value={productId}
                        onValueChange={(val) => setProductId(val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('stockSelector.selectProduct')}/>
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {loadingStocks && <p className="text-sm text-gray-500 mt-4">{t('stockSelector.loadingStocks')}</p>}

                {!loadingStocks && matchingStocks.length > 0 && (
                    <>
                        <h3 className="mt-4 text-sm font-medium text-gray-700">
                            {t('stockSelector.selectBatch')}
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-auto">
                            {matchingStocks.map((stock) => (
                                <div
                                    key={stock.id}
                                    onClick={() => setSelectedStock(stock)}
                                    className={`p-2 border rounded cursor-pointer ${
                                        selectedStock?.id === stock.id
                                            ? "border-blue-500 bg-blue-50"
                                            : ""
                                    }`}
                                >
                                    <div className="text-sm font-medium">
                                        {t('stockSelector.quantityWithUom', {
                                            quantity: stock.input_quantity,
                                            uom: stock.uom?.symbol
                                        })}
                                    </div>
                                    {stock.dimensions?.length > 0 && (
                                        <div className="text-xs text-gray-500">
                                            {stock.dimensions
                                                .map(
                                                    (d) => t('stockSelector.dimensionLine', {
                                                        name: d.name,
                                                        value: d.value,
                                                        unit: d.uom_symbol
                                                    })
                                                )
                                                .join(", ")}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!loadingStocks && matchingStocks.length === 0 && (
                    <p className="text-sm text-gray-500 mt-4">{t('stockSelector.noMatch')}</p>
                )}

                <div className="flex justify-end mt-6 space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        {t('global.cancel')}
                    </Button>
                    <Button onClick={handleProceed} disabled={!selectedStock || loadingStocks}>
                        {t('global.continue')}
                    </Button>
                </div>
            </Modal>

            {activeModal === "issueStock" && selectedStock && (
                <IssueStockFormModal
                    showModal={true}
                    onClose={closeAll}
                    stockItem={selectedStock}
                    fromSelector={true}
                    onBack={() => setActiveModal(null)}
                />
            )}

            {activeModal === "transferStock" && selectedStock && (
                <TransferStockFormModal
                    showModal={true}
                    onClose={closeAll}
                    stockItem={selectedStock}
                    onBack={() => setActiveModal(null)}
                />
            )}

            {activeModal === "adjustStock" && selectedStock && (
                <AdjustStockFormModal
                    showModal={true}
                    onClose={closeAll}
                    stockItem={selectedStock}
                    onBack={() => setActiveModal(null)}
                />
            )}

            {activeModal === "stockCount" && selectedStock && (
                <StockCountModal
                    showModal={true}
                    onClose={closeAll}
                    stockItem={selectedStock}
                    onBack={() => setActiveModal(null)}
                />
            )}
        </>
    );
};

export default StockSelectorModal;
