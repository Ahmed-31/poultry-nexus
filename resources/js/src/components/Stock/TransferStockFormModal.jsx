import React, {useEffect, useState} from 'react';
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

const TransferStockFormModal = ({
                                    showModal, onClose, stockItem, onBack = () => {
    }
                                }) => {
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

    const product = products.find(p => p.id === stockItem?.product_id);
    const sourceWarehouse = warehouses.find(w => w.id === stockItem?.warehouse_id);
    const availableWarehouses = warehouses.filter(w => w.id !== stockItem?.warehouse_id);

    const allowedUoms = product?.allowed_uoms?.length ? product.allowed_uoms : [product?.default_uom];

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
                title: "Invalid Quantity",
                description: "Quantity must be greater than 0.",
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
                title: "Success",
                description: "Stock transferred successfully.",
                variant: "default"
            });
            reset();
            onClose();
        } catch (err) {
            toast({
                title: "Error",
                description: err?.message || "Transfer failed.",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transfer Stock</h2>

            {product && (
                <div className="mb-2">
                    <Label>Product</Label>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                </div>
            )}

            {sourceWarehouse && (
                <div className="mb-2">
                    <Label>Source Warehouse</Label>
                    <p className="text-sm font-medium text-gray-800">{sourceWarehouse.name}</p>
                </div>
            )}

            {stockItem?.dimensions?.length > 0 && (
                <div className="mb-2">
                    <Label>Dimensions</Label>
                    <p className="text-sm text-gray-600">
                        {stockItem.dimensions
                            .map(d => `${d.name}: ${d.value} ${d.uom_symbol}`)
                            .join(", ")}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <Label>Available Quantity</Label>
                    <p className="text-sm text-gray-700">
                        {stockItem.input_quantity} {stockItem.uom?.symbol}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Quantity to Transfer</Label>
                        <Input
                            type="number"
                            step="any"
                            {...register("input_quantity", {required: true, min: 0.01})}
                        />
                        {errors.input_quantity && <p className="text-red-500 text-sm">Required</p>}
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
                </div>

                <div className="space-y-1">
                    <Label>Destination Warehouse</Label>
                    <Select
                        onValueChange={(val) => setValue("destination_warehouse_id", val)}
                        value={watch("destination_warehouse_id")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select warehouse"/>
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
                    {errors.destination_warehouse_id && <p className="text-red-500 text-sm">Required</p>}
                </div>

                <div className="space-y-1">
                    <Label>Reason</Label>
                    <Select
                        onValueChange={(val) => setValue("reason", val)}
                        value={watch("reason")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select reason"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rebalancing">Rebalancing</SelectItem>
                            <SelectItem value="overstock">Overstock</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register("reason", {required: true})} />
                    {errors.reason && <p className="text-red-500 text-sm">Required</p>}
                </div>

                <div className="space-y-1">
                    <Label>Transfer Reference (optional)</Label>
                    <Input type="text" {...register("transfer_reference")} />
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
                                className="bg-blue-600 text-white hover:bg-blue-700">
                            {submitting ? "Transferring..." : "Transfer Stock"}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default TransferStockFormModal;
