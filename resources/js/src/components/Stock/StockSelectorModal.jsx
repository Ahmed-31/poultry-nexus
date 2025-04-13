import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import Modal from "@/src/components/common/Modal.jsx";
import {fetchMatchingStocks} from "@/src/services/stockService";
import {toast} from "@/hooks/use-toast";
import {fetchProducts} from "@/src/store/productsSlice.jsx";
import {fetchWarehouses} from "@/src/store/warehouseSlice.jsx";
import IssueStockFormModal from "@/src/components/Stock/IssueStockFormModal";
import TransferStockFormModal from "@/src/components/Stock/TransferStockFormModal";
import AdjustStockFormModal from "@/src/components/Stock/AdjustStockFormModal";
import StockCountModal from "@/src/components/Stock/StockCountModal.jsx";

const StockSelectorModal = ({showModal, onClose, action}) => {
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
                        title: "Error",
                        description: "Failed to load stock items",
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
                <h2 className="text-lg font-semibold mb-4">Select Product and Warehouse</h2>

                <Label className="mt-4">Warehouse</Label>
                {warehouseLoading ? (
                    <p className="text-sm text-gray-500 my-2">Loading warehouses...</p>
                ) : (
                    <Select
                        value={warehouseId}
                        onValueChange={(val) => setWarehouseId(val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select warehouse"/>
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

                <Label>Product</Label>
                {productLoading ? (
                    <p className="text-sm text-gray-500 my-2">Loading products...</p>
                ) : (
                    <Select
                        value={productId}
                        onValueChange={(val) => setProductId(val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select product"/>
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

                {loadingStocks && <p className="text-sm text-gray-500 mt-4">Loading stock batches...</p>}

                {!loadingStocks && matchingStocks.length > 0 && (
                    <>
                        <h3 className="mt-4 text-sm font-medium text-gray-700">
                            Select Stock Batch
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
                                        Qty: {stock.input_quantity} ({stock.uom?.symbol})
                                    </div>
                                    {stock.dimensions?.length > 0 && (
                                        <div className="text-xs text-gray-500">
                                            {stock.dimensions
                                                .map(
                                                    (d) => `${d.name}: ${d.value} ${d.uom_symbol}`
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
                    <p className="text-sm text-gray-500 mt-4">No matching stock found.</p>
                )}

                <div className="flex justify-end mt-6 space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleProceed} disabled={!selectedStock || loadingStocks}>
                        Continue
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
