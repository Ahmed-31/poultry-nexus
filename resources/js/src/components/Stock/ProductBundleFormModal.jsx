import React, {useEffect} from 'react';
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {useDispatch, useSelector} from 'react-redux';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast";
import {fetchProducts} from "@/src/store/productsSlice.jsx";
import {addProductBundle, editProductBundle} from "@/src/store/productBundlesSlice.jsx";
import {SmartSelect} from "@/src/components/common/SmartSelect.jsx";
import {fetchUoms} from "@/src/store/uomSlice.jsx";

const ProductBundleFormModal = ({showModal, onClose, initialData = null}) => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products?.list || []);
    const uoms = useSelector(state => state.uoms.list);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset,
        setValue,
        watch
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            items: []
        }
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "items"
    });

    const getUomSymbol = (uom_id) => {
        const match = uoms.find(u => u.id === uom_id);
        return match ? `(${match.symbol})` : '';
    };

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchUoms());
    }, [dispatch]);

    useEffect(() => {
        if (initialData && products.length) {
            const items = initialData.products?.map(p => {
                const matchedProduct = products.find(prod => prod.id === p.id);
                const dimensionDefs = matchedProduct?.dimensions || [];

                const dimensions = dimensionDefs.reduce((acc, dim) => {
                    const dimName = dim.name;
                    acc[dimName] = p.dimension_values?.[dimName] || '';
                    return acc;
                }, {});

                return {
                    product_id: p.id,
                    uom_id: p.uom_id || p.pivot?.uom_id || '',
                    quantity: p.quantity || p.pivot?.quantity || 1,
                    dimensions
                };
            }) || [];

            reset({
                name: initialData.name || '',
                description: initialData.description || '',
                items
            });
        }
    }, [initialData, products, reset]);

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                await dispatch(editProductBundle({id: initialData.id, productBundle: data})).unwrap();
            } else {
                await dispatch(addProductBundle({productBundle: data})).unwrap();
                reset();
            }

            toast({title: "Success", description: "Product bundle saved successfully."});
        } catch (err) {
            toast({title: "Error", description: err.message || "Something went wrong.", variant: "destructive"});
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">{initialData ? "Edit Bundle" : "Add Bundle"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>Name</Label>
                    <Input {...register("name", {required: "Name is required"})} />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>Description</Label>
                    <textarea
                        {...register("description")}
                        className="border p-2 w-full rounded-md"
                    />
                </div>

                <div>
                    <Label>Products in Bundle</Label>
                    <div className="space-y-6">
                        {fields.map((item, index) => {
                            const selectedProductId = watch(`items.${index}.product_id`);
                            const selectedProduct = products.find(p => p.id === selectedProductId);
                            const currentDimensions = watch(`items.${index}.dimensions`);

                            return (
                                <div key={item.id} className="space-y-4 border p-4 rounded-lg">
                                    {/* Product Selector */}
                                    <div>
                                        <Label className="mb-2 block">Product</Label>
                                        <Controller
                                            name={`items.${index}.product_id`}
                                            control={control}
                                            rules={{required: "Product is required"}}
                                            render={({field}) => (
                                                <SmartSelect
                                                    multiple={false}
                                                    options={products.map(p => ({
                                                        value: p.id,
                                                        label: p.name,
                                                    }))}
                                                    selected={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select a product"
                                                />
                                            )}
                                        />
                                        {errors?.items?.[index]?.product_id && (
                                            <p className="text-red-500 text-sm mt-1">Product is required.</p>
                                        )}
                                    </div>

                                    {/* Quantity & UOM */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="mb-2 block">Quantity</Label>
                                            <Input
                                                type="number"
                                                step="1"
                                                min="1"
                                                {...register(`items.${index}.quantity`, {required: true, min: 1})}
                                            />
                                            {errors?.items?.[index]?.quantity && (
                                                <p className="text-red-500 text-sm mt-1">Quantity is required.</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="mb-2 block">Unit of Measure</Label>
                                            <Controller
                                                name={`items.${index}.uom_id`}
                                                control={control}
                                                rules={{required: true}}
                                                render={({field}) => (
                                                    <SmartSelect
                                                        multiple={false}
                                                        options={selectedProduct?.allowed_uoms?.map(u => ({
                                                            value: u.id,
                                                            label: `${u.name} (${u.symbol})`,
                                                        })) || []}
                                                        selected={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Select UOM"
                                                    />
                                                )}
                                            />
                                            {errors?.items?.[index]?.uom_id && (
                                                <p className="text-red-500 text-sm mt-1">Unit is required.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dimensions */}
                                    {selectedProduct?.dimensions?.length > 0 && (
                                        <div>
                                            <h3 className="text-md font-semibold mb-2">Dimensions</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedProduct.dimensions.map((dimension) => (
                                                    <div key={dimension.id}>
                                                        <Label className="mb-1 block">
                                                            {dimension.name}
                                                            <span className="ml-1 text-sm text-gray-500">
                                                                {getUomSymbol(dimension.uom_id)}
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            placeholder={`Enter ${dimension.name}`}
                                                            value={currentDimensions?.[dimension.name] || ""}
                                                            onChange={(e) =>
                                                                setValue(`items.${index}.dimensions.${dimension.name}`, e.target.value)
                                                            }
                                                        />
                                                        {errors?.items?.[index]?.dimensions?.[dimension.name] && (
                                                            <p className="text-red-500 text-sm mt-1">
                                                                {dimension.name} is required.
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => remove(index)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            );
                        })}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({product_id: '', uom_id: '', quantity: 1, dimensions: {}})}
                        >
                            + Add Product
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                        {initialData ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductBundleFormModal;
