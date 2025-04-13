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

const IssueStockFormModal = ({
                                 showModal, onClose, stockItem = null, fromSelector = false, onBack = () => {
    }
                             }) => {
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
                title: "Missing Data",
                description: "Please select both product and warehouse.",
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
                title: "Success",
                description: "Stock issued successfully.",
                variant: "default",
            });

            reset();
            onClose();

        } catch (err) {
            toast({
                title: "Error",
                description: err?.message || "Failed to issue stock.",
                variant: "destructive",
            });
        }
    };

    if (!products.length || !warehouses.length || !uoms.length) {
        return (
            <Modal isOpen={showModal} onClose={onClose}>
                <div className="p-4">Loading form data...</div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Issue Stock</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <Label>Warehouse</Label>
                    <Select
                        value={watch("warehouse_id")}
                        onValueChange={(value) => setValue("warehouse_id", value)}
                        disabled
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select warehouse"/>
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
                    <Label>Product</Label>
                    <Select
                        value={watch("product_id")}
                        onValueChange={(value) => setValue("product_id", value)}
                        disabled
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select product"/>
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
                        <Label>Quantity</Label>
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
                        <Label>UoM</Label>
                        <Select
                            onValueChange={(value) => setValue("input_uom_id", value)}
                            value={watch("input_uom_id")}
                            disabled={!allowedUoms.length}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select UoM"/>
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
                    <Label>Reason</Label>
                    <Select
                        onValueChange={(value) => setValue("reason", value)}
                        value={watch("reason")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select reason"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sale">Sale</SelectItem>
                            <SelectItem value="damage">Damage</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="internal">Internal Use</SelectItem>
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register("reason", {required: true})} />
                    {errors.reason && (
                        <p className="text-red-500 text-sm">Required</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Issued To (optional)</Label>
                    <Input type="text" {...register("issued_to")} />
                </div>

                <div className="space-y-1">
                    <Label>Issue Reference (optional)</Label>
                    <Input type="text" {...register("issue_reference")} />
                </div>

                <div className="flex justify-between items-center pt-4">
                    {fromSelector && (
                        <Button type="button" variant="ghost" onClick={onBack}>
                            ← Back
                        </Button>
                    )}
                    <div className="ml-auto space-x-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                            Issue Stock
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default IssueStockFormModal;
