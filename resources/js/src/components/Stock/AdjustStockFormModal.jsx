import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast";
import {fetchProducts} from "@/src/store/productsSlice.jsx";
import {adjustStockItem} from "@/src/store/stockSlice";
import {useTranslation} from "react-i18next";

const AdjustStockFormModal = ({
                                  showModal, onClose, stockItem, onBack = () => {
    }
                              }) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.list || []);
    const [submitting, setSubmitting] = useState(false);

    const product = products.find(p => p.id === stockItem?.product_id);
    const allowedUoms = product?.allowed_uoms?.length ? product.allowed_uoms : [product?.default_uom];

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
            adjustment_type: 'increase',
            reason: '',
            reference: ''
        }
    });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (stockItem && allowedUoms?.length) {
            reset({
                input_quantity: '',
                input_uom_id: allowedUoms[0]?.id?.toString() || '',
                adjustment_type: 'increase',
                reason: '',
                reference: ''
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
            await dispatch(adjustStockItem({
                id: stockItem.id,
                data: {
                    input_quantity: qty,
                    input_uom_id: parseInt(data.input_uom_id),
                    adjustment_type: data.adjustment_type,
                    reason: data.reason,
                    reference: data.reference
                }
            })).unwrap();

            toast({
                title: t('global.toasts.successTitle'),
                description: t('adjustStock.toasts.successDesc'),
                variant: "default"
            });

            reset();
            onClose();
        } catch (err) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: err?.message || t('global.toasts.errorMessage'),
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('adjustStock.title')}</h2>

            {product && (
                <div className="mb-2">
                    <Label>{t('adjustStock.fields.product')}</Label>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                </div>
            )}

            <div className="mb-2">
                <Label>{t('adjustStock.fields.warehouse')}</Label>
                <p className="text-sm font-medium text-gray-800">{stockItem.warehouse_name || stockItem?.warehouse?.name}</p>
            </div>

            {stockItem?.dimensions?.length > 0 && (
                <div className="mb-2">
                    <Label>{t('adjustStock.fields.dimensions')}</Label>
                    <p className="text-sm text-gray-600">
                        {stockItem.dimensions.map(d => `${d.name}: ${d.value} ${d.uom_symbol}`).join(", ")}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <Label>{t('adjustStock.fields.currentQty')}</Label>
                    <p className="text-sm text-gray-700">
                        {stockItem.input_quantity} {stockItem.uom?.symbol}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>{t('adjustStock.fields.type')}</Label>
                        <Select
                            onValueChange={(val) => setValue("adjustment_type", val)}
                            value={watch("adjustment_type")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('adjustStock.placeholders.type')}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="increase">Increase</SelectItem>
                                <SelectItem value="decrease">Decrease</SelectItem>
                            </SelectContent>
                        </Select>
                        <input type="hidden" {...register("adjustment_type", {required: true})} />
                    </div>

                    <div className="space-y-1">
                        <Label>{t('adjustStock.fields.quantity')}</Label>
                        <Input
                            type="number"
                            step="any"
                            {...register("input_quantity", {required: true, min: 0.01})}
                        />
                        {errors.input_quantity && <p className="text-red-500 text-sm">{t('global.required')}</p>}
                    </div>
                </div>

                <div className="space-y-1">
                    <Label>{t('adjustStock.fields.uom')}</Label>
                    <Select
                        onValueChange={(val) => setValue("input_uom_id", val)}
                        value={watch("input_uom_id")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('adjustStock.placeholders.uom')}/>
                        </SelectTrigger>
                        <SelectContent>
                            {allowedUoms?.map((uom) => (
                                <SelectItem key={uom.id} value={uom.id.toString()}>
                                    {uom.name} ({uom.symbol})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register("input_uom_id", {required: true})} />
                    {errors.input_uom_id && <p className="text-red-500 text-sm">{t('global.required')}</p>}
                </div>

                <div className="space-y-1">
                    <Label>{t('adjustStock.fields.reason')}</Label>
                    <Input type="text" {...register("reason")} />
                </div>

                <div className="space-y-1">
                    <Label>{t('adjustStock.fields.reference')}</Label>
                    <Input type="text" {...register("reference")} />
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
                                className="bg-yellow-600 text-white hover:bg-yellow-700">
                            {submitting ? t('adjustStock.actions.submitting') : t('adjustStock.actions.submit')}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AdjustStockFormModal;
