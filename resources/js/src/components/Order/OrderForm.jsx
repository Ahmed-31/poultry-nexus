import React, {useEffect, useState} from 'react';
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

const PRIORITY_LEVELS = [
    {value: 1, label: 'Very Low', description: 'Can be delayed'},
    {value: 2, label: 'Low', description: 'Less urgent'},
    {value: 3, label: 'Medium', description: 'Default level'},
    {value: 4, label: 'High', description: 'High priority'},
    {value: 5, label: 'Very High', description: 'Top priority order'},
];

const OrderForm = ({onClose, initialData, showModal}) => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.list || []);
    const customers = useSelector(state => state.customers.list || []);
    const productBundles = useSelector(state => state.productBundles.list || []);
    const [errorMessage, setErrorMessage] = useState(null);

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
                customer_id: initialData.customer_id?.toString() || '',
                order_number: initialData.order_number || '',
                ordered_at: initialData.ordered_at?.split('T')[0] || '',
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
            const cleanData = {
                ...data,
                order_bundles: data.order_bundles.map(bundle => ({
                    ...bundle,
                    total_units: bundle.poultry_house_count * bundle.lines_number * bundle.units_per_line
                }))
            };

            if (initialData) {
                await dispatch(editOrder({id: initialData.id, order: cleanData})).unwrap();
            } else {
                await dispatch(createOrder({order: cleanData})).unwrap();
            }
            onClose();
        } catch (err) {
            setErrorMessage(err?.message || 'Something went wrong!');
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
                {initialData ? 'Edit Order' : 'Create New Order'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-h-[70vh] overflow-y-auto pr-1">
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
                        {errorMessage}
                    </div>
                )}

                <div>
                    <Controller
                        name={"customer_id"}
                        control={control}
                        rules={{required: true}}
                        render={({field}) => (
                            <SmartSelect
                                label={"Customer"}
                                placeholder={"Select Customer"}
                                options={customers.map((c) => ({label: c.name, value: c.id}))}
                                selected={field.value}
                                onChange={field.onChange}
                                multiple={false}
                            />
                        )}
                    />
                    {errors.customer_id && <p className="text-red-500 text-sm">Customer is required.</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <Label>Order Date</Label>
                        <Input type="date" {...register("ordered_at", {required: true})} />
                    </div>
                    <div>
                        <Label>Order Number</Label>
                        <Input type="text" {...register("order_number", {required: true})} />
                    </div>
                    <div className="flex flex-col">
                        <Label className="flex items-center gap-1 mb-1">
                            Priority
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
                                    placeholder="Select Priority"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Order Items */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Order Items</h3>
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
                                                    label="Product"
                                                    placeholder="Select Product"
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
                                            <p className="text-red-500 text-sm mt-1">Product is required.</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Quantity</Label>
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
                                                    label="Unit of Measure"
                                                    placeholder="Select UOM"
                                                    options={uoms.map((uom) => ({
                                                        label: `${uom.name} (${uom.symbol})`,
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
                                            <h4 className="text-md font-semibold mb-2">Dimensions</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedProduct.dimensions.map(dimension => (
                                                    <div key={dimension.id}>
                                                        <Label>{dimension.name} ({dimension.uom?.symbol})</Label>
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
                                    <Button type="button" variant="destructive" onClick={() => removeItem(index)}>Remove
                                        Item</Button>
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
                        + Add Product
                    </Button>
                </div>

                {/* Order Bundles */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Order Bundles</h3>
                    {orderBundles.map((bundle, index) => (
                        <div key={bundle.id} className="border rounded-xl p-5 bg-white space-y-5 shadow-sm">
                            <div>
                                <Controller
                                    name={`order_bundles.${index}.product_bundle_id`}
                                    control={control}
                                    rules={{required: true}}
                                    render={({field}) => (
                                        <SmartSelect
                                            label="Product Bundle"
                                            placeholder="Select Bundle"
                                            options={productBundles.map((pb) => ({
                                                label: pb.name,
                                                value: pb.id.toString(),
                                            }))}
                                            selected={field.value?.toString() || ""}
                                            onChange={field.onChange}
                                            multiple={false}
                                        />
                                    )}
                                />

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['height', 'belt_width', 'levels', 'units_per_line', 'lines_number', 'poultry_house_count'].map((field) => (
                                    <div key={field}>
                                        <Label>{field.replace(/_/g, ' ')}</Label>
                                        <Input type="number"
                                               min="1" {...register(`order_bundles.${index}.${field}`, {required: true})} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <Button type="button" variant="destructive" onClick={() => removeBundle(index)}>Remove
                                    Bundle</Button>
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            appendBundle({
                                product_bundle_id: '',
                                height: 1,
                                belt_width: 1,
                                lines_number: 1,
                                units_per_line: 1,
                                poultry_house_count: 1,
                                levels: 1
                            })}
                    >
                        + Add Bundle
                    </Button>
                </div>

                <div>
                    <Label>Notes</Label>
                    <Textarea {...register("notes")} rows="4"/>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t mt-8">
                    <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                    <Button type="submit">{initialData ? 'Update Order' : 'Create Order'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default OrderForm;
