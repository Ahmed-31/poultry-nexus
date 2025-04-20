import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchProducts} from "@/src/store/productsSlice";
import {fetchWarehouses} from "@/src/store/warehouseSlice";
import {fetchUoms} from "@/src/store/uomSlice";
import BackButton from '@/src/components/common/BackButton';
import {addStockItem} from "@/src/store/stockSlice.jsx";
import {toast} from "@/hooks/use-toast.js";

export default function ManualStockScan() {
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
            input_uom_id: '',
            dimensions: {},
            warehouse_id: ''
        }
    });

    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.list || []);
    const warehouses = useSelector((state) => state.warehouses.list || []);
    const uoms = useSelector((state) => state.uoms.list || []);

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const productId = parseInt(watch("product_id"));
    const selectedProduct = products.find(p => p.id === productId);
    const selectedProductUoms = selectedProduct?.allowed_uoms?.length > 0
        ? selectedProduct.allowed_uoms
        : selectedProduct?.default_uom ? [selectedProduct.default_uom] : [];

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
        dispatch(fetchUoms());
    }, [dispatch]);

    useEffect(() => {
        setValue("input_uom_id", selectedProductUoms?.[0]?.id?.toString() || '');
        setValue("dimensions", {});
    }, [productId]);

    useEffect(() => {
        if (selectedProduct?.dimensions?.length) {
            selectedProduct.dimensions.forEach(dimension => {
                setValue(`dimensions.${dimension.id}.dimension_id`, dimension.id);
                setValue(`dimensions.${dimension.id}.uom_id`, dimension.uom_id);
            });
        }
    }, [selectedProduct, setValue]);

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

        const finalData = {
            ...data,
            dimensions
        };

        try {
            await dispatch(addStockItem({data: finalData})).unwrap();

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
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-2xl mx-auto">
                <div className="mb-4">
                    <BackButton/>
                </div>
                <h1 className="text-2xl font-semibold mb-6">{t('manualScan.title')}</h1>
                <Card>
                    <CardContent className="space-y-6 p-6">
                        {!selectedWarehouse ? (
                            <div>
                                <Label>{t('manualScan.selectWarehouse')}</Label>
                                <Select onValueChange={(value) => {
                                    setSelectedWarehouse(value);
                                    setValue("warehouse_id", value);
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('manualScan.placeholders.warehouse')}/>
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
                                        <Label>{t('manualScan.fields.warehouse')}</Label>
                                        <Input
                                            disabled
                                            value={warehouses.find(w => w.id.toString() === selectedWarehouse)?.name || ''}
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
                                            {t('manualScan.actions.changeWarehouse')}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <Label>{t('manualScan.fields.product')}</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setValue("product_id", value);
                                            setValue("input_uom_id", '');
                                        }}
                                        value={watch("product_id")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('manualScan.placeholders.product')}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((p) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.product_id && <p className="text-red-500 text-sm">{t('manualScan.errors.product')}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>{t('manualScan.fields.quantity')}</Label>
                                        <Input
                                            type="number"
                                            {...register("input_quantity", {required: true})}
                                        />
                                        {errors.input_quantity &&
                                            <p className="text-red-500 text-sm">{t('manualScan.errors.quantity')}</p>}
                                    </div>

                                    <div>
                                        <Label>{t('manualScan.fields.uom')}</Label>
                                        <Select
                                            onValueChange={(value) => setValue("input_uom_id", value)}
                                            value={watch("input_uom_id")}
                                            disabled={!productId || selectedProductUoms.length === 0}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('manualScan.placeholders.uom')}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {selectedProductUoms.map((uom) => (
                                                    <SelectItem key={uom.id} value={uom.id.toString()}>
                                                        {uom.name} ({uom.symbol})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <input type="hidden" {...register("input_uom_id", {required: true})}/>
                                        {errors.input_uom_id &&
                                            <p className="text-red-500 text-sm">{t('manualScan.errors.uom')}</p>}
                                    </div>
                                </div>

                                {selectedProduct?.dimensions?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{t('manualScan.fields.dimensions')}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedProduct.dimensions.map((dimension) => (
                                                <div key={dimension.id}>
                                                    <Label>
                                                        {dimension.name}
                                                        <span className="ml-1 text-sm text-gray-500">
                                                            {getUomSymbol(dimension.uom_id)}
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder={t('manualScan.placeholders.dimension', {name: dimension.name})}
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
                                                            {t('manualScan.errors.dimensionRequired', {name: dimension.name})}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" className="w-full">
                                    {t('manualScan.actions.submit')}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
