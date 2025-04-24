import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts} from '@/src/store/productsSlice';
import {fetchStock} from '@/src/store/stockSlice';
import {Label} from '@/components/ui/label';
import Modal from '@/src/components/common/Modal';
import {ScrollArea} from '@/components/ui/scroll-area';
import {SmartSelect} from "@/src/components/common/SmartSelect";
import {useTranslation} from "react-i18next";

const StockCountModal = ({showModal, onClose}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.list || []);
    const allStock = useSelector((state) => state.stock.list || []);
    const loading = useSelector((state) => state.stock.loading);

    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchStock());
    }, [dispatch]);

    const groupedStockByWarehouse = () => {
        if (!selectedProductId) return {};
        const productStock = allStock.filter(s => s.product_id === parseInt(selectedProductId));
        return productStock.reduce((acc, stock) => {
            const warehouse = stock.warehouse?.name || `Warehouse #${stock.warehouse_id}`;
            if (!acc[warehouse]) acc[warehouse] = [];
            acc[warehouse].push(stock);
            return acc;
        }, {});
    };

    const stockByWarehouse = groupedStockByWarehouse();
    const flatStocks = Object.values(stockByWarehouse).flat();
    const totalQuantity = flatStocks.reduce((sum, stock) => sum + (stock.input_quantity || 0), 0);
    const uomSymbol = flatStocks[0]?.input_uom?.symbol || '';

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('stockCount.title')}</h2>

            <Label>{t('stockCount.fields.product')}</Label>
            <SmartSelect
                multiple={false}
                options={products.map((p) => ({
                    label: p.name,
                    value: p.id.toString()
                }))}
                selected={selectedProductId?.toString()}
                onChange={(val) => setSelectedProductId(val)}
                placeholder={t('stockCount.placeholders.product')}
            />

            {loading && <p className="text-sm text-gray-500 mt-4">{t('stockCount.messages.loading')}</p>}

            {!loading && selectedProductId && (
                <>
                    <div className="mt-4 text-sm font-semibold text-gray-700">
                        {t('stockCount.labels.totalQuantity', {quantity: totalQuantity, symbol: uomSymbol})}
                    </div>
                    <ScrollArea className="max-h-96 mt-4 pr-2">
                        {Object.entries(stockByWarehouse).length === 0 && (
                            <p className="text-gray-500 text-sm">{t('stockCount.messages.noStock')}</p>
                        )}
                        {Object.entries(stockByWarehouse).map(([warehouse, stocks]) => (
                            <div key={warehouse} className="mb-6">
                                <h3 className="text-md font-semibold text-blue-700 mb-2">{warehouse}</h3>
                                <div className="space-y-2">
                                    {stocks.map(stock => (
                                        <div
                                            key={stock.id}
                                            className="border p-3 rounded bg-gray-50 shadow-sm"
                                        >
                                            <div className="text-sm font-medium">
                                                {t('stockCount.labels.quantity', {
                                                    quantity: stock.input_quantity,
                                                    uom: stock.input_uom?.symbol
                                                })}
                                            </div>
                                            {stock.dimension_values?.length > 0 && (
                                                <div className="text-xs text-gray-600">
                                                    {stock.dimension_values.map(dv => `${dv.t(`dimensions.${dimension.name}`)}: ${dv.value} ${dv.dimension.uom.symbol}`).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </>
            )}

            <div className="mt-6 flex justify-end">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded" onClick={onClose}>
                    {t('global.close')}
                </button>
            </div>
        </Modal>
    );
};

export default StockCountModal;
