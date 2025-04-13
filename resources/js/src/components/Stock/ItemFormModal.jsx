import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm, Controller} from "react-hook-form";
import {useSelector, useDispatch} from 'react-redux';
import {addProduct, editProduct} from '../../store/productsSlice.jsx';
import {fetchUoms} from "@/src/store/uomSlice.jsx";
import {fetchCategories} from "@/src/store/categorySlice.jsx";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast";
import {fetchUomDimensions} from "@/src/store/uomDimensionsSlice.jsx";
import {SmartSelect} from "@/src/components/common/SmartSelect.jsx";

const ItemFormModal = ({showModal, onClose, initialData = null}) => {
    const dispatch = useDispatch();

    const uoms = useSelector(state => state.uoms?.list || []);
    const categories = useSelector(state => state.categories?.list || []);
    const dimensions = useSelector(state => state.uomDimensions?.list || []);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        watch,
        setValue,
        control
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: '',
            min_stock: 0,
            sku: '',
            default_uom_id: '',
            category_id: '',
            type: '',
            allowed_uoms: [],
            dimensions: []
        }
    });

    const allowedUoms = watch("allowed_uoms");
    const selectedDimensions = watch("dimensions");

    useEffect(() => {
        if (initialData && uoms.length && categories.length) {
            reset({
                name: initialData.name || "",
                description: initialData.description || "",
                price: initialData.price || "",
                min_stock: initialData.min_stock || 0,
                sku: initialData.sku || "",
                type: initialData.type || "",
                default_uom_id: initialData.default_uom?.id?.toString() || "",
                category_id: initialData.category?.id?.toString() || "",
                allowed_uoms: initialData.allowed_uoms?.map((u) => u.id) || [],
                dimensions: initialData.dimensions?.map((d) => d.id) || [],
            });
        }
    }, [initialData, uoms, categories, dimensions, reset]);

    useEffect(() => {
        dispatch(fetchUoms());
        dispatch(fetchCategories());
        dispatch(fetchUomDimensions());
    }, [dispatch]);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            price: parseFloat(data.price),
            min_stock: parseInt(data.min_stock),
        };

        try {
            if (initialData) {
                await dispatch(editProduct({id: initialData.id, product: payload})).unwrap();
            } else {
                await dispatch(addProduct({product: payload})).unwrap();
            }

            toast({
                title: "Success",
                description: "Product saved successfully.",
                variant: "default",
            });

            reset();
            onClose();

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
            <h2 className="text-lg font-bold mb-4">{initialData ? "Edit Product" : "Add Product"}</h2>
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
                    <Label>Price</Label>
                    <Input type="number" step="0.01" {...register("price", {required: "Price is required"})} />
                    {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                </div>

                <div>
                    <Label>Minimum Stock</Label>
                    <Input type="number" {...register("min_stock")} />
                </div>

                <div>
                    <Label>SKU</Label>
                    <Input {...register("sku", {required: "SKU is required"})} />
                    {errors.sku && <p className="text-red-500 text-xs">{errors.sku.message}</p>}
                </div>

                <div>
                    <Label>Unit</Label>
                    <Controller
                        control={control}
                        name="default_uom_id"
                        rules={{required: "Unit is required"}}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Unit"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {uoms.map((uom) => (
                                        <SelectItem key={uom.id} value={uom.id.toString()}>
                                            {uom.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.default_uom_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.default_uom_id.message}</p>
                    )}
                </div>

                <div>
                    <Label>Category</Label>
                    <Controller
                        control={control}
                        name="category_id"
                        rules={{required: "Category is required"}}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.category_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>
                    )}
                </div>

                <div>
                    <Label>Type</Label>
                    <Controller
                        control={control}
                        name="type"
                        rules={{required: "Type is required"}}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="raw_material">Raw Material</SelectItem>
                                    <SelectItem value="component">Component</SelectItem>
                                    <SelectItem value="consumable">Consumable</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && (
                        <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Allowed Units</label>
                    <SmartSelect
                        multiple={true}
                        options={uoms.map((uom) => ({
                            value: uom.id,
                            label: uom.name,
                        }))}
                        selected={allowedUoms}
                        onChange={(val) => setValue("allowed_uoms", val)}
                        placeholder="Select Allowed Units"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Dimensions</label>
                    <SmartSelect
                        multiple={true}
                        options={dimensions.map((dim) => ({
                            value: dim.id,
                            label: `${dim.name} (${dim.uom?.name || "-"})`,
                        }))}
                        selected={selectedDimensions}
                        onChange={(val) => setValue("dimensions", val)}
                        placeholder="Select Dimensions"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        {initialData ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ItemFormModal;
