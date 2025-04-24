import React, {useEffect, useState, useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast";
import {fetchWarehouses} from "@/src/store/warehouseSlice.jsx";
import {fetchProducts} from "@/src/store/productsSlice.jsx";
import {transferStockItem} from "@/src/store/stockSlice";
import {useTranslation} from "react-i18next";

const TransferStockFormModal = ({
                                    showModal, onClose, stockItem, onBack = () => {
    }
                                }) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const warehouses = useSelector((state) => state.warehouses.list || []);
    const products = useSelector((state) => state.products.list || []);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            input_quantity: '',
            input_uom_id: '',
            destination_warehouse_id: '',
            reason: '',
            transfer_reference: ''
        }
    });

    useEffect(() => {
        dispatch(fetchWarehouses());
        dispatch(fetchProducts());
    }, [dispatch]);

    const product = useMemo(() => {
        return products.find(p => p.id === stockItem?.product_id);
    }, [products, stockItem]);
    const sourceWarehouse = warehouses.find(w => w.id === stockItem?.warehouse_id);
    const availableWarehouses = warehouses.filter(w => w.id !== stockItem?.warehouse_id);

    const allowedUoms = useMemo(() => {
        if (!product) return [];
        return product.allowed_uoms?.length ? product.allowed_uoms : [product.default_uom];
    }, [product]);

    useEffect(() => {
        if (stockItem && allowedUoms?.length) {
            reset({
                input_quantity: '',
                input_uom_id: allowedUoms[0]?.id?.toString() || '',
                destination_warehouse_id: '',
                reason: '',
                transfer_reference: ''
            });
        }
    }, [stockItem, allowedUoms]);

    const onSubmit = async (data) => {
        const qty = parseFloat(data.input_quantity);

        if (qty <= 0) {
            toast({
                title: t('global.toasts.invalidQtyTitle'),
                description: t('global.toasts.invalidQtyDesc'),
                variant: "destructive"
            });
            return;
        }

        setSubmitting(true);
        try {
            await dispatch(transferStockItem({
                id: stockItem.id,
                data: {
                    input_quantity: qty,
                    input_uom_id: parseInt(data.input_uom_id),
                    destination_warehouse_id: parseInt(data.destination_warehouse_id),
                    reason: data.reason,
                    transfer_reference: data.transfer_reference
                }
            })).unwrap();

            toast({
                title: t('global.toasts.successTitle'),
                description: t('transferStock.toast.successMessage'),
                variant: "default",
            });
            reset();
            onClose();
        } catch (err) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: err.message || t('global.toasts.errorMessage'),
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('transferStock.title')}</h2>

            {product && (
                <div className="mb-2">
                    <Label>{t('transferStock.product')}</Label>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                </div>
            )}

            {sourceWarehouse && (
                <div className="mb-2">
                    <Label>{t('transferStock.sourceWarehouse')}</Label>
                    <p className="text-sm font-medium text-gray-800">{sourceWarehouse.name}</p>
                </div>
            )}

            {stockItem?.dimensions?.length > 0 && (
                <div className="mb-2">
                    <Label>{t('transferStock.dimensions')}</Label>
                    <p className="text-sm text-gray-600">
                        {stockItem.dimensions
                            .map(d => `${d.name}: ${d.value} ${d.uom_symbol}`)
                            .join(", ")}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <Label>{t('transferStock.availableQty')}</Label>
                    <p className="text-sm text-gray-700">
                        {stockItem.input_quantity} {stockItem.uom?.symbol}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>{t('transferStock.qtyToTransfer')}</Label>
                        <Input
                            type="number"
                            step="any"
                            {...register("input_quantity", {required: true, min: 0.01})}
                        />
                        {errors.input_quantity && <p className="text-red-500 text-sm">{t('global.required')}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>{t('transferStock.uom')}</Label>
                        <Select
                            onValueChange={(val) => setValue("input_uom_id", val)}
                            value={watch("input_uom_id")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('transferStock.selectUom')}/>
                            </SelectTrigger>
                            <SelectContent>
                                {allowedUoms?.map((uom) => (
                                    <SelectItem key={uom.id} value={uom.id.toString()}>
                                        {t(`uoms.${uom.name}`)} ({uom.symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input type="hidden" {...register("input_uom_id", {required: true})} />
                        {errors.input_uom_id && <p className="text-red-500 text-sm">{t('global.required')}</p>}
                    </div>
                </div>

                <div className="space-y-1">
                    <Label>{t('transferStock.destinationWarehouse')}</Label>
                    <Select
                        onValueChange={(val) => setValue("destination_warehouse_id", val)}
                        value={watch("destination_warehouse_id")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('transferStock.selectWarehouse')}/>
                        </SelectTrigger>
                        <SelectContent>
                            {availableWarehouses.map((w) => (
                                <SelectItem key={w.id} value={w.id.toString()}>
                                    {w.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register("destination_warehouse_id", {required: true})} />
                    {errors.destination_warehouse_id && <p className="text-red-500 text-sm">{t('global.required')}</p>}
                </div>

                <div className="space-y-1">
                    <Label>{t('transferStock.reason')}</Label>
                    <Select
                        onValueChange={(val) => setValue("reason", val)}
                        value={watch("reason")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('transferStock.selectReason')}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rebalancing">{t('transferStock.reason.rebalancing')}</SelectItem>
                            <SelectItem value="overstock">{t('transferStock.reason.overstock')}</SelectItem>
                            <SelectItem value="maintenance">{t('transferStock.reason.maintenance')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register("reason", {required: true})} />
                    {errors.reason && <p className="text-red-500 text-sm">{t('global.required')}</p>}
                </div>

                <div className="space-y-1">
                    <Label>{t('transferStock.referenceOptional')}</Label>
                    <Input type="text" {...register("transfer_reference")} />
                </div>

                <div className="flex justify-between items-center pt-4">
                    <Button type="button" variant="ghost" onClick={onBack}>
                        ← {t('global.back')}
                    </Button>
                    <div className="ml-auto space-x-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('global.cancel')}
                        </Button>
                        <Button type="submit" disabled={submitting}
                                className="bg-blue-600 text-white hover:bg-blue-700">
                            {submitting ? t('transferStock.transferring') : t('transferStock.submit')}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default TransferStockFormModal;
