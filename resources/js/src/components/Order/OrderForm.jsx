import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {createOrder, editOrder} from '@/src/store/ordersSlice';
import {fetchProducts} from '@/src/store/productsSlice';
import {fetchCustomers} from '@/src/store/customersSlice';
import {fetchProductBundles} from '@/src/store/productBundlesSlice';
import {Label} from "@/components/ui/label";
import Modal from "@/src/components/common/Modal.jsx";
import {Info} from "lucide-react";
import {SmartSelect} from "@/src/components/common/SmartSelect.jsx";
import {toast} from "@/hooks/use-toast.js";
import {useTranslation} from "react-i18next";

const OrderForm = ({onClose, initialData, showModal}) => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.list || []);
    const customers = useSelector(state => state.customers.list || []);
    const productBundles = useSelector(state => state.productBundles.list || []);
    const {t} = useTranslation();

    const PRIORITY_LEVELS = [
        {value: 1, label: t('priority.1.label'), description: t('priority.1.description')},
        {value: 2, label: t('priority.2.label'), description: t('priority.2.description')},
        {value: 3, label: t('priority.3.label'), description: t('priority.3.description')},
        {value: 4, label: t('priority.4.label'), description: t('priority.4.description')},
        {value: 5, label: t('priority.5.label'), description: t('priority.5.description')},
    ];

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: {errors},
    } = useForm({
        defaultValues: {
            customer_id: '',
            order_number: '',
            ordered_at: new Date().toISOString().split('T')[0],
            order_items: [],
            order_bundles: [],
            notes: '',
            priority: 3
        }
    });

    const {
        fields: orderItems,
        append: appendItem,
        remove: removeItem
    } = useFieldArray({control, name: 'order_items'});

    const {
        fields: orderBundles,
        append: appendBundle,
        remove: removeBundle
    } = useFieldArray({control, name: 'order_bundles'});

    useEffect(() => {
        if (!products.length) dispatch(fetchProducts());
        if (!customers.length) dispatch(fetchCustomers());
        if (!productBundles.length) dispatch(fetchProductBundles());
    }, [dispatch]);

    useEffect(() => {
        if (initialData) {
            reset({
                customer_id: initialData.customer_id || '',
                order_number: initialData.order_number || '',
                ordered_at: new Date(initialData.ordered_at).toISOString().split('T')[0] || '',
                priority: initialData.priority || 3,
                notes: initialData.notes || '',
                order_items: initialData.order_items?.map(item => ({
                    ...item,
                    dimensions: item?.dimension_values?.reduce((acc, dim) => {
                        acc[dim.dimension.id] = {
                            value: dim.value,
                            dimension_id: dim.dimension.id,
                            uom_id: dim.uom_id
                        };
                        return acc;
                    }, {}) || {}
                })) || [],
                order_bundles: initialData.bundles || []
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        try {
            const cleanData = {...data};

            if (initialData) {
                await dispatch(editOrder({id: initialData.id, order: cleanData})).unwrap();
            } else {
                await dispatch(createOrder({order: cleanData})).unwrap();
            }
            toast({
                title: t('global.toasts.successTitle'),
                description: t('orderForm.toast.successMessage'),
                variant: "default",
            });
            onClose();
        } catch (err) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: err.message || t('global.toasts.errorMessage'),
                variant: "destructive",
            });
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
                {initialData ? t('orderForm.title.edit') : t('orderForm.title.create')}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-h-[70vh] overflow-y-auto pr-1">
                <div>
                    <Controller
                        name={"customer_id"}
                        control={control}
                        rules={{required: true}}
                        render={({field}) => (
                            <SmartSelect
                                label={t('orderForm.fields.customer.label')}
                                placeholder={t('orderForm.fields.customer.placeholder')}
                                options={customers.map((c) => ({label: c.name, value: c.id}))}
                                selected={field.value}
                                onChange={field.onChange}
                                multiple={false}
                            />
                        )}
                    />
                    {errors.customer_id &&
                        <p className="text-red-500 text-sm">{t('orderForm.fields.customer.required')}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <Label>{t('orderForm.fields.date.label')}</Label>
                        <Input type="date" {...register("ordered_at", {required: true})} />
                    </div>
                    <div>
                        <Label>{t('orderForm.fields.number.label')}</Label>
                        <Input type="text" disabled={!!initialData} {...register("order_number", {required: true})} />
                    </div>
                    <div className="flex flex-col">
                        <Label className="flex items-center gap-1 mb-1">
                            {t('orderForm.fields.priority.label')}
                            <Info size={14} className="text-gray-500" title="1 = Very Low, 5 = Very High"/>
                        </Label>
                        <Controller
                            name="priority"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <SmartSelect
                                    multiple={false}
                                    options={PRIORITY_LEVELS.map(p => ({label: p.label, value: p.value}))}
                                    selected={field.value}
                                    onChange={field.onChange}
                                    placeholder={t('orderForm.fields.priority.placeholder')}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Order Items */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">{t('orderForm.sections.orderItems')}</h3>
                    {orderItems.map((item, index) => {
                        const productId = watch(`order_items.${index}.product_id`);
                        const selectedProduct = products.find(p => p.id === parseInt(productId));
                        const uoms = selectedProduct?.allowed_uoms?.length
                            ? selectedProduct.allowed_uoms
                            : selectedProduct?.default_uom ? [selectedProduct.default_uom] : [];

                        return (
                            <div key={item.id} className="border rounded-xl p-5 bg-white space-y-5 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Controller
                                            name={`order_items.${index}.product_id`}
                                            control={control}
                                            rules={{required: true}}
                                            render={({field}) => (
                                                <SmartSelect
                                                    label={t('orderForm.fields.product.label')}
                                                    placeholder={t('orderForm.fields.product.placeholder')}
                                                    options={products.map((p) => ({
                                                        label: p.name,
                                                        value: p.id.toString(),
                                                    }))}
                                                    selected={field.value?.toString() || ""}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        const newProduct = products.find((p) => p.id === parseInt(value));
                                                        const defaultUomId = newProduct?.allowed_uoms?.[0]?.id || newProduct?.default_uom?.id;
                                                        if (defaultUomId) {
                                                            setValue(`order_items.${index}.uom_id`, defaultUomId.toString());
                                                        }
                                                    }}
                                                    multiple={false}
                                                />
                                            )}
                                        />
                                        {errors.order_items?.[index]?.product_id && (
                                            <p className="text-red-500 text-sm mt-1">{t('orderForm.fields.product.required')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>{t('orderForm.fields.quantity.label')}</Label>
                                        <Input type="number"
                                               min="1" {...register(`order_items.${index}.quantity`, {required: true})} />
                                    </div>

                                    <div>
                                        <Controller
                                            name={`order_items.${index}.uom_id`}
                                            control={control}
                                            rules={{required: true}}
                                            render={({field}) => (
                                                <SmartSelect
                                                    label={t('orderForm.fields.uom.label')}
                                                    placeholder={t('orderForm.fields.uom.placeholder')}
                                                    options={uoms.map((uom) => ({
                                                        label: `${t(`uoms.${uom.name}`)} (${uom.symbol})`,
                                                        value: uom.id.toString(),
                                                    }))}
                                                    selected={field.value?.toString() || ""}
                                                    onChange={field.onChange}
                                                    multiple={false}
                                                    disabled={!selectedProduct}
                                                />
                                            )}
                                        />

                                    </div>
                                </div>

                                {
                                    selectedProduct?.dimensions?.length > 0 && (
                                        <div>
                                            <h4 className="text-md font-semibold mb-2">{t('orderForm.fields.dimensions.label')}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedProduct.dimensions.map(dimension => (
                                                    <div key={dimension.id}>
                                                        <Label>{t(`dimensions.${dimension.name}`)} ({dimension.uom?.symbol})</Label>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            {...register(`order_items.${index}.dimensions.${dimension.id}.value`, {required: true})}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            {...register(`order_items.${index}.dimensions.${dimension.id}.dimension_id`)}
                                                            value={dimension.id}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            {...register(`order_items.${index}.dimensions.${dimension.id}.uom_id`)}
                                                            value={dimension.uom_id}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }

                                <div className="flex justify-end">
                                    <Button type="button" variant="destructive"
                                            onClick={() => removeItem(index)}>{t('orderForm.buttons.removeItem')}</Button>
                                </div>
                            </div>
                        )
                            ;
                    })}

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => appendItem({product_id: '', quantity: 1, uom_id: '', dimensions: {}})}
                    >
                        + {t('orderForm.buttons.addItem')}
                    </Button>
                </div>

                {/* Order Bundles */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">{t('orderForm.sections.bundles')}</h3>
                    {orderBundles.map((bundle, index) => {
                        const selectedBundleId = watch(`order_bundles.${index}.product_bundle_id`);
                        const selectedBundle = productBundles.find(pb => pb.id === parseInt(selectedBundleId));

                        const parameters = selectedBundle?.parameters || [];

                        return (
                            <div key={bundle.id} className="border rounded-xl p-5 bg-white space-y-5 shadow-sm">
                                <div>
                                    <Controller
                                        name={`order_bundles.${index}.product_bundle_id`}
                                        control={control}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <SmartSelect
                                                label={t('orderForm.fields.bundle.label')}
                                                placeholder={t('orderForm.fields.bundle.placeholder')}
                                                options={productBundles.map((pb) => ({
                                                    label: pb.name,
                                                    value: pb.id.toString(),
                                                }))}
                                                selected={field.value?.toString() || ""}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    setValue(`order_bundles.${index}.parameters`, {});
                                                }}
                                                multiple={false}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Parameters Dynamic Fields */}
                                {parameters.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {parameters.map((param) => (
                                            <div key={param.id}>
                                                <Label>{param.translations?.ar || param.name}</Label>
                                                <Input
                                                    type={param.type === 'number' ? 'number' : 'text'}
                                                    {...register(`order_bundles.${index}.parameters.${param.name}`, {required: param.type === 'number'})}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button type="button" variant="destructive" onClick={() => removeBundle(index)}>
                                        {t('orderForm.buttons.removeBundle')}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            appendBundle({
                                product_bundle_id: '',
                                parameters: {}
                            })}
                    >
                        + {t('orderForm.buttons.addBundle')}
                    </Button>
                </div>

                <div>
                    <Label>{t('orderForm.fields.notes.label')}</Label>
                    <Textarea {...register("notes")} rows="4"/>
                </div>

                <div className="sticky bottom-0 flex justify-end space-x-4 pt-4 border-t mt-8">
                    <Button type="button" onClick={onClose} variant="outline">{t('orderForm.buttons.cancel')}</Button>
                    <Button
                        type="submit">{initialData ? t('orderForm.buttons.update') : t('orderForm.buttons.create')}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default OrderForm;
