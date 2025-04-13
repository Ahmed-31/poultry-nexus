import React, {useState, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import {useSelector, useDispatch} from 'react-redux';
import {addStockItem, updateStockItem} from '../../store/stockSlice';
import {fetchProducts} from "@/src/store/productsSlice.jsx";
import {fetchWarehouses} from "@/src/store/warehouseSlice.jsx";
import {fetchUoms} from "@/src/store/uomSlice.jsx";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast";

const StockFormModal = ({showModal, onClose, initialData = null}) => {
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.list || []);
    const warehouses = useSelector((state) => state.warehouses.list || []);
    const uoms = useSelector(state => state.uoms.list);
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        watch
    } = useForm({
        defaultValues: {
            product_id: '',
            input_quantity: '',
            warehouse_id: '',
            dimensions: {},
            input_uom_id: ''
        }
    });

    const watchedProductId = watch("product_id");
    const productId = watchedProductId ? parseInt(watchedProductId) : null;
    const selectedProduct = products.find(p => p.id === productId);
    const selectedProductUoms = selectedProduct
        ? (selectedProduct.allowed_uoms?.length > 0 ? selectedProduct.allowed_uoms : [selectedProduct.default_uom])
        : [];

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);


    useEffect(() => {
        if (initialData) {
            setValue("product_id", initialData?.product?.id?.toString() || '');
            setValue("input_quantity", initialData?.input_quantity?.toString() || '');
            setValue("warehouse_id", initialData?.warehouse?.id?.toString() || '');
            setValue("input_uom_id", initialData?.input_uom_id?.toString() || '');
            setSelectedWarehouse(initialData?.warehouse?.id?.toString() || null);
            if (initialData.dimension_values) {
                initialData.dimension_values.forEach((dim) => {
                    setValue(`dimensions.${dim.dimension_id}.value`, dim.value.toString());
                    setValue(`dimensions.${dim.dimension_id}.uom_id`, dim.uom_id.toString());
                });
            }
        }
    }, [initialData, setValue]);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
        dispatch(fetchUoms());
    }, [dispatch]);

    useEffect(() => {
        if (productId && selectedProduct) {
            const availableUoms = selectedProduct.allowed_uoms?.length > 0
                ? selectedProduct.allowed_uoms
                : [selectedProduct.default_uom];

            if (availableUoms?.[0]?.id) {
                setValue("input_uom_id", availableUoms[0].id.toString());
            }
        }
    }, [productId, selectedProduct, setValue]);

    const getUomSymbol = (uom_id) => {
        const match = uoms.find(u => u.id === uom_id);
        return match ? `(${match.symbol})` : '';
    };

    const onSubmit = async (data) => {
        const dimensions = Object.values(data.dimensions || {}).map(d => ({
            dimension_id: parseInt(d.dimension_id),
            value: parseFloat(d.value),
            uom_id: parseInt(d.uom_id),
        }));

        const payload = {
            ...data,
            dimensions,
        };

        try {
            if (initialData) {
                await dispatch(updateStockItem({id: initialData.id, data: payload})).unwrap();
            } else {
                await dispatch(addStockItem({data: payload})).unwrap();
            }

            toast({
                title: "Success",
                description: "Stock item saved successfully.",
                variant: "default",
            });

            reset({
                product_id: '',
                input_quantity: '',
                input_uom_id: '',
                dimensions: {},
                warehouse_id: selectedWarehouse,
            });

        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Something went wrong.",
                variant: "destructive",
            });
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
                {initialData ? 'Edit Stock Item' : 'Add New Stock Item'}
            </h2>

            {!selectedWarehouse ? (
                <div>
                    <Label>Select Warehouse to Start</Label>
                    <Select onValueChange={(value) => {
                        setSelectedWarehouse(value);
                        setValue("warehouse_id", value);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a warehouse"/>
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map((w) => (
                                <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="w-full">
                            <Label>Warehouse</Label>
                            <Input value={warehouses.find(w => w.id.toString() === selectedWarehouse)?.name || ''}
                                   disabled
                                   className="w-full"
                            />
                            <input type="hidden" {...register("warehouse_id")} value={selectedWarehouse}/>
                        </div>
                        <div className="mt-6 ml-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSelectedWarehouse(null);
                                    reset();
                                }}
                            >
                                Change Warehouse
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2 block">Product</Label>
                        <Select onValueChange={(value) => {
                            setValue("product_id", value);
                            setValue("input_uom_id", '');
                        }}
                                value={watch("product_id")}
                        >
                            <SelectTrigger className="w-full p-3 border rounded-lg">
                                <SelectValue placeholder="Select Product"/>
                            </SelectTrigger>
                            <SelectContent>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <SelectItem key={product.id} value={product.id.toString()}>
                                            {product.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="nan" disabled>
                                        No products available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.product_id && <p className="text-red-500 text-sm">Product is required.</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 block">Quantity</Label>
                            <Input
                                type="number"
                                {...register("input_quantity", {required: true})}
                            />
                            {errors.input_quantity && <p className="text-red-500 text-sm">Quantity is required.</p>}
                        </div>

                        <div>
                            <Label className="mb-2 block">Unit of Measure</Label>
                            <Select
                                onValueChange={(value) => setValue("input_uom_id", value)}
                                value={watch("input_uom_id")}
                                disabled={!productId || selectedProductUoms.length === 0}
                            >
                                <SelectTrigger className="w-full p-3 border rounded-lg">
                                    <SelectValue placeholder="Select UOM"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedProductUoms.map((uom) => (
                                        <SelectItem key={uom.id} value={uom.id.toString()}>
                                            {uom.name} ({uom.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input type="hidden" {...register("input_uom_id", {required: true})} />
                            {errors.input_uom_id && <p className="text-red-500 text-sm">Unit is required.</p>}
                        </div>
                    </div>

                    {selectedProduct?.dimensions?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Dimensions</h3>
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
                                            {...register(`dimensions.${dimension.id}.value`, {required: true})}
                                        />
                                        <input
                                            type="hidden"
                                            {...register(`dimensions.${dimension.id}.dimension_id`)}
                                            value={dimension.id}
                                        />
                                        <input
                                            type="hidden"
                                            {...register(`dimensions.${dimension.id}.uom_id`)}
                                            value={dimension.uom_id}
                                        />
                                        {errors?.dimensions?.[dimension.id]?.value && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {dimension.name} is required.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                        <Button type="submit">{initialData ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default StockFormModal;
