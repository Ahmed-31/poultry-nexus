import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm, Controller} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast";
import {useTranslation} from "react-i18next";
import {addUomItem, updateUomItem} from "@/src/store/uomSlice.jsx";
import {fetchUomGroups} from "@/src/store/uomGroupSlice.jsx";
import {fetchUomDimensions} from "@/src/store/uomDimensionsSlice.jsx";
import {SmartSelect} from "@/src/components/common/SmartSelect.jsx";

const UomFormModal = ({showModal, onClose, initialData = null}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const uomGroups = useSelector(state => state.uomGroups.list || []);
    const dimensions = useSelector(state => state.uomDimensions.list || []);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        control,
    } = useForm({
        defaultValues: {
            name: '',
            symbol: '',
            group_id: '',
            is_base: false,
            conversion_factor: 1,
            dimension_ids: [],
        }
    });

    useEffect(() => {
        dispatch(fetchUomGroups());
        dispatch(fetchUomDimensions());
    }, [dispatch]);

    useEffect(() => {
        if (initialData && uomGroups.length && dimensions.length) {
            reset({
                name: t(`uoms.${initialData.name}`) || "",
                symbol: initialData.symbol || "",
                group_id: initialData.group_id?.toString() || "",
                is_base: initialData.is_base || false,
                conversion_factor: initialData.conversion_factor || 1,
                dimension_ids: initialData.dimensions?.map(d => d.id) || [],
            });
        }
    }, [initialData, uomGroups, dimensions, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                conversion_factor: parseFloat(data.conversion_factor),
                is_base: !!data.is_base,
            };

            if (initialData) {
                await dispatch(updateUomItem({id: initialData.id, data: payload})).unwrap();
            } else {
                await dispatch(addUomItem({data: payload})).unwrap();
            }

            toast({
                title: t('global.toasts.successTitle'),
                description: t('uomForm.toast.successMessage'),
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
            <h2 className="text-lg font-bold mb-4">
                {initialData ? t('uomForm.title.edit') : t('uomForm.title.add')}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>{t("uomForm.fields.name")}</Label>
                    <Input {...register("name", {required: t("uomForm.validation.name")})} />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>{t("uomForm.fields.symbol")}</Label>
                    <Input {...register("symbol", {required: t("uomForm.validation.symbol")})} />
                    {errors.symbol && <p className="text-red-500 text-xs">{errors.symbol.message}</p>}
                </div>

                <div>
                    <Label>{t("uomForm.fields.group")}</Label>
                    <Controller
                        control={control}
                        name="group_id"
                        rules={{required: t("uomForm.validation.group")}}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("uomForm.placeholders.group")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {uomGroups.map(group => (
                                        <SelectItem key={group.id} value={group.id.toString()}>
                                            {t(`uomGroups.${group.name}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.group_id && <p className="text-red-500 text-xs mt-1">{errors.group_id.message}</p>}
                </div>

                <div>
                    <Label>{t("uomForm.fields.conversionFactor")}</Label>
                    <Input
                        type="number"
                        step="0.01"
                        {...register("conversion_factor", {required: t("uomForm.validation.conversionFactor")})}
                    />
                    {errors.conversion_factor && (
                        <p className="text-red-500 text-xs">{errors.conversion_factor.message}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_base"
                        {...register("is_base")}
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <Label htmlFor="is_base">{t("uomForm.fields.isBase")}</Label>
                </div>

                <div>
                    <Label>{t("uomForm.fields.dimensions")}</Label>
                    <Controller
                        control={control}
                        name="dimension_ids"
                        render={({field: {value, onChange}}) => (
                            <SmartSelect
                                multiple={true}
                                options={dimensions.map((dim) => ({
                                    value: dim.id,
                                    label: t(`dimensions.${dim.name}`),
                                }))}
                                selected={value}
                                onChange={onChange}
                                placeholder={t("uomForm.placeholders.dimensions")}
                            />
                        )}
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

export default UomFormModal;
