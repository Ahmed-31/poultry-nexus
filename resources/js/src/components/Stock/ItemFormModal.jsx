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
import {useTranslation} from "react-i18next";

const ItemFormModal = ({showModal, onClose, initialData = null}) => {
    const {t} = useTranslation();
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
                title: t('global.toasts.successTitle'),
                description: t('itemForm.toast.successMessage'),
                variant: "default",
            });

            reset();
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
            <h2 className="text-lg font-bold mb-4">{initialData ? t('itemForm.title.edit') : t('itemForm.title.add')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>{t("itemForm.fields.name")}</Label>
                    <Input {...register("name", {required: "Name is required"})} />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>{t("itemForm.fields.description")}</Label>
                    <textarea
                        {...register("description")}
                        className="border p-2 w-full rounded-md"
                    />
                </div>

                <div>
                    <Label>{t("itemForm.fields.price")}</Label>
                    <Input type="number" step="0.01" {...register("price", {required: "Price is required"})} />
                    {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                </div>

                <div>
                    <Label>{t("itemForm.fields.minStock")}</Label>
                    <Input type="number" {...register("min_stock")} />
                </div>

                <div>
                    <Label>{t("itemForm.fields.sku")}</Label>
                    <Input {...register("sku", {required: "SKU is required"})} />
                    {errors.sku && <p className="text-red-500 text-xs">{errors.sku.message}</p>}
                </div>

                <div>
                    <Label>{t("itemForm.fields.defaultUom")}</Label>
                    <Controller
                        control={control}
                        name="default_uom_id"
                        rules={{required: "Unit is required"}}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("itemForm.placeholders.uom")}/>
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
                    <Label>{t("itemForm.fields.category")}</Label>
                    <Controller
                        control={control}
                        name="category_id"
                        rules={{required: "Category is required"}}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("itemForm.placeholders.category")}/>
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
                    <Label>{t("itemForm.fields.type")}</Label>
                    <Controller
                        control={control}
                        name="type"
                        rules={{required: "Type is required"}}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("itemForm.placeholders.type")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="raw_material">{t("itemForm.types.raw")}</SelectItem>
                                    <SelectItem value="component">{t("itemForm.types.component")}</SelectItem>
                                    <SelectItem value="consumable">{t("itemForm.types.consumable")}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && (
                        <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">{t("itemForm.fields.allowedUoms")}</label>
                    <SmartSelect
                        multiple={true}
                        options={uoms.map((uom) => ({
                            value: uom.id,
                            label: uom.name,
                        }))}
                        selected={allowedUoms}
                        onChange={(val) => setValue("allowed_uoms", val)}
                        placeholder={t("itemForm.placeholders.allowedUoms")}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">{t("itemForm.fields.dimensions")}</label>
                    <SmartSelect
                        multiple={true}
                        options={dimensions.map((dim) => ({
                            value: dim.id,
                            label: `${dim.name} (${dim.uom?.name || "-"})`,
                        }))}
                        selected={selectedDimensions}
                        onChange={(val) => setValue("dimensions", val)}
                        placeholder={t("itemForm.placeholders.dimensions")}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        {t("global.cancel")}
                    </Button>
                    <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        {initialData ? t('global.update') : t('global.create')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ItemFormModal;
