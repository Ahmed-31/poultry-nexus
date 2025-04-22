import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {useDispatch} from 'react-redux';
import {addWarehouse, editWarehouse} from '@/src/store/warehouseSlice.jsx';
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast";
import {useTranslation} from "react-i18next";

const WarehouseFormModal = ({showModal, onClose, initialData}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            name: '',
            location: '',
            description: '',
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || '',
                location: initialData.location || '',
                description: initialData.description || '',
            });
        } else {
            reset();
        }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                await dispatch(editWarehouse({id: initialData.id, data})).unwrap();
            } else {
                await dispatch(addWarehouse({data})).unwrap();
                reset();
            }

            toast({
                title: t('global.toasts.successTitle'),
                description: t('warehouseForm.toast.successMessage'),
                variant: "default",
            });
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
            <h2 className="text-lg font-bold mb-4">{initialData ? t('warehouseForm.editTitle') : t('warehouseForm.addTitle')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>{t('warehouseForm.nameLabel')}</Label>
                    <Input
                        {...register("name", {required: t('warehouseForm.nameRequired')})}
                        className="w-full"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>{t('warehouseForm.locationLabel')}</Label>
                    <Input
                        {...register("location", {required: t('warehouseForm.locationRequired')})}
                        className="w-full"
                    />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>

                <div>
                    <Label>{t('warehouseForm.descriptionLabel')}</Label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded-md"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} variant="outline">
                        {t('global.cancel')}
                    </Button>
                    <Button type="submit">
                        {initialData ? t('global.update') : t('global.create')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default WarehouseFormModal;
