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

const AdjustStockFormModal = ({
                                  showModal, onClose, stockItem, onBack = () => {
    }
                              }) => {
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
                title: "Invalid Quantity",
                description: "Quantity must be greater than 0.",
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
                title: "Success",
                description: "Stock adjusted successfully.",
                variant: "default"
            });

            reset();
            onClose();
        } catch (err) {
            toast({
                title: "Error",
                description: err?.message || "Adjustment failed.",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Adjust Stock</h2>

            {product && (
                <div className="mb-2">
                    <Label>Product</Label>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                </div>
            )}

            <div className="mb-2">
                <Label>Warehouse</Label>
                <p className="text-sm font-medium text-gray-800">{stockItem.warehouse_name || stockItem?.warehouse?.name}</p>
            </div>

            {stockItem?.dimensions?.length > 0 && (
                <div className="mb-2">
                    <Label>Dimensions</Label>
                    <p className="text-sm text-gray-600">
                        {stockItem.dimensions.map(d => `${d.name}: ${d.value} ${d.uom_symbol}`).join(", ")}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <Label>Current Quantity</Label>
                    <p className="text-sm text-gray-700">
                        {stockItem.input_quantity} {stockItem.uom?.symbol}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Adjustment Type</Label>
                        <Select
                            onValueChange={(val) => setValue("adjustment_type", val)}
                            value={watch("adjustment_type")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="increase">Increase</SelectItem>
                                <SelectItem value="decrease">Decrease</SelectItem>
                            </SelectContent>
                        </Select>
                        <input type="hidden" {...register("adjustment_type", {required: true})} />
                    </div>

                    <div className="space-y-1">
                        <Label>Quantity</Label>
                        <Input
                            type="number"
                            step="any"
                            {...register("input_quantity", {required: true, min: 0.01})}
                        />
                        {errors.input_quantity && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                </div>

                <div className="space-y-1">
                    <Label>Unit of Measure</Label>
                    <Select
                        onValueChange={(val) => setValue("input_uom_id", val)}
                        value={watch("input_uom_id")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select UoM"/>
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
                    {errors.input_uom_id && <p className="text-red-500 text-sm">Required</p>}
                </div>

                <div className="space-y-1">
                    <Label>Reason (optional)</Label>
                    <Input type="text" {...register("reason")} />
                </div>

                <div className="space-y-1">
                    <Label>Reference (optional)</Label>
                    <Input type="text" {...register("reference")} />
                </div>

                <div className="flex justify-between items-center pt-4">
                    <Button type="button" variant="ghost" onClick={onBack}>
                        ← Back
                    </Button>
                    <div className="ml-auto space-x-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}
                                className="bg-yellow-600 text-white hover:bg-yellow-700">
                            {submitting ? "Adjusting..." : "Adjust Stock"}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AdjustStockFormModal;
