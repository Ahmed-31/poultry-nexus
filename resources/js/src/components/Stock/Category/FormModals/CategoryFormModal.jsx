import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch} from 'react-redux';
import {Button} from "@/Components/ui/button.jsx";
import {Input} from "@/Components/ui/input.jsx";
import {Label} from "@/Components/ui/label.jsx";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast.js";
import {addCategory, editCategory} from "@/src/store/categorySlice.jsx";
import {useTranslation} from "react-i18next";

const CategoryFormModal = ({showModal, onClose, initialData = null}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || '',
                description: initialData.description || '',
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                await dispatch(editCategory({id: initialData.id, productBundle: data})).unwrap();
            } else {
                await dispatch(addCategory({category: data})).unwrap();
                reset();
            }

            toast({title: t('global.toasts.successTitle'), description: t('categoryForm.toast.successMessage')});
        } catch (err) {
            toast({
                title: t('global.toasts.error'),
                description: err.message || t('global.toasts.errorMessage'),
                variant: "destructive"
            });
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">{initialData ? t('categoryForm.title.edit') : t('categoryForm.title.add')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>{t('categoryForm.fields.name')}</Label>
                    <Input {...register("name", {required: t('global.required')})} />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>{t('categoryForm.fields.description')}</Label>
                    <textarea
                        {...register("description")}
                        className="border p-2 w-full rounded-md"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        {t('global.cancel')}
                    </Button>
                    <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                        {initialData ? t('global.update') : t('global.create')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CategoryFormModal;
