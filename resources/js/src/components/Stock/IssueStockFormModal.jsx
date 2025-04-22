import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import {useSelector, useDispatch} from 'react-redux';
import {issueStockItem} from '@/src/store/stockSlice';
import {fetchProducts} from "@/src/store/productsSlice.jsx";
import {fetchWarehouses} from "@/src/store/warehouseSlice.jsx";
import {fetchUoms} from "@/src/store/uomSlice.jsx";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast";
import {useTranslation} from "react-i18next";

const IssueStockFormModal = ({
                                 showModal, onClose, stockItem = null, fromSelector = false, onBack = () => {
    }
                             }) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.list || []);
    const warehouses = useSelector((state) => state.warehouses.list || []);
    const uoms = useSelector((state) => state.uoms.list || []);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        watch
    } = useForm({
        defaultValues: {
            product_id: stockItem?.product_id?.toString() || '',
            input_quantity: '',
            input_uom_id: stockItem?.input_uom_id?.toString() || '',
            warehouse_id: stockItem?.warehouse_id?.toString() || '',
            reason: '',
            issued_to: '',
            issue_reference: ''
        }
    });

    const watchedProductId = watch("product_id");

    const productId = watchedProductId ? parseInt(watchedProductId) : null;
    const selectedProduct = products.find(p => p.id === productId);

    const allowedUoms = selectedProduct
        ? (selectedProduct.allowed_uoms?.length ? selectedProduct.allowed_uoms : [selectedProduct.default_uom])
        : [];

    useEffect(() => {
        if (!stockItem || !products.length || !warehouses.length || !uoms.length) return;

        reset({
            product_id: stockItem.product_id?.toString() || '',
            input_quantity: '',
            input_uom_id: stockItem.input_uom_id?.toString() || '',
            warehouse_id: stockItem.warehouse_id?.toString() || '',
            reason: '',
            issued_to: '',
            issue_reference: ''
        });
    }, [JSON.stringify(stockItem), products.length, warehouses.length, uoms.length]);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
        dispatch(fetchUoms());
    }, [dispatch]);

    useEffect(() => {
        if (selectedProduct && allowedUoms.length > 0) {
            setValue("input_uom_id", allowedUoms[0]?.id?.toString());
        }
    }, [selectedProduct]);

    const onSubmit = async (data) => {
        if (!stockItem?.id && (!data.product_id || !data.warehouse_id)) {
            toast({
                title: t('global.missingData.title'),
                description: t('global.missingData.message'),
                variant: "destructive",
            });
            return;
        }

        try {
            await dispatch(issueStockItem({
                id: stockItem?.id,
                data: {
                    input_quantity: parseFloat(data.input_quantity),
                    input_uom_id: parseInt(data.input_uom_id),
                    reason: data.reason,
                    issued_to: data.issued_to,
                    issue_reference: data.issue_reference
                }
            })).unwrap();

            toast({
                title: t('global.toasts.successTitle'),
                description: t('issueStock.toast.successMessage'),
                variant: "default",
            });

            reset();
            onClose();

        } catch (err) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: err?.message || t('global.toasts.errorMessage'),
                variant: "destructive",
            });
        }
    };

    if (!products.length || !warehouses.length || !uoms.length) {
        return (
            <Modal isOpen={showModal} onClose={onClose}>
                <div className="p-4">{t('issueStock.formLoading')}</div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">{t('issueStock.title')}</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <Label>{t('issueStock.fields.warehouse')}</Label>
                    <Select
                        value={watch("warehouse_id")}
                        onValueChange={(value) => setValue("warehouse_id", value)}
                        disabled
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('issueStock.placeholders.warehouse')}/>
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map((w) => (
                                <SelectItem key={w.id} value={w.id.toString()}>
                                    {w.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register("warehouse_id")} />
                </div>

                <div className="space-y-1">
                    <Label>{t('issueStock.fields.product')}</Label>
                    <Select
                        value={watch("product_id")}
                        onValueChange={(value) => setValue("product_id", value)}
                        disabled
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('issueStock.placeholders.product')}/>
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register("product_id")} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>{t('issueStock.fields.quantity')}</Label>
                        <Input
                            type="number"
                            step="any"
                            {...register("input_quantity", {required: true, min: 0.01})}
                        />
                        {errors.input_quantity && (
                            <p className="text-red-500 text-sm">Required</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>{t('issueStock.fields.uom')}</Label>
                        <Select
                            onValueChange={(value) => setValue("input_uom_id", value)}
                            value={watch("input_uom_id")}
                            disabled={!allowedUoms.length}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('issueStock.placeholders.uom')}/>
                            </SelectTrigger>
                            <SelectContent>
                                {allowedUoms.map((uom) => (
                                    <SelectItem key={uom.id} value={uom.id.toString()}>
                                        {uom.name} ({uom.symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input type="hidden" {...register("input_uom_id", {required: true})} />
                        {errors.input_uom_id && (
                            <p className="text-red-500 text-sm">Required</p>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <Label>{t('issueStock.fields.reason')}</Label>
                    <Select
                        onValueChange={(value) => setValue("reason", value)}
                        value={watch("reason")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('issueStock.placeholders.reason')}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sale">{t('issueStock.reasons.sale')}</SelectItem>
                            <SelectItem value="damage">{t('issueStock.reasons.damage')}</SelectItem>
                            <SelectItem value="expired">{t('issueStock.reasons.expired')}</SelectItem>
                            <SelectItem value="internal">{t('issueStock.reasons.internal')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register("reason", {required: true})} />
                    {errors.reason && (
                        <p className="text-red-500 text-sm">{t('global.required')}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>{t('issueStock.fields.issuedTo')}</Label>
                    <Input type="text" {...register("issued_to")} />
                </div>

                <div className="space-y-1">
                    <Label>{t('issueStock.fields.issueReference')}</Label>
                    <Input type="text" {...register("issue_reference")} />
                </div>

                <div className="flex justify-between items-center pt-4">
                    {fromSelector && (
                        <Button type="button" variant="ghost" onClick={onBack}>
                            ← {t('global.back')}
                        </Button>
                    )}
                    <div className="ml-auto space-x-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('global.cancel')}
                        </Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                            {t('issueStock.actions.submit')}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default IssueStockFormModal;
