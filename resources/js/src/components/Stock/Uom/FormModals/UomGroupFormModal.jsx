import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import Modal from '@/src/components/common/Modal.jsx';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useTranslation} from 'react-i18next';
import {toast} from '@/hooks/use-toast';
import {createUomGroup, editUomGroup} from '@/src/store/uomGroupSlice.jsx';

const UomGroupFormModal = ({showModal, onClose, initialData = null}) => {
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
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({name: initialData.name || ''});
        }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                await dispatch(editUomGroup({id: initialData.id, data: data})).unwrap();
            } else {
                await dispatch(createUomGroup({data: data})).unwrap();
            }

            toast({
                title: t('global.toasts.successTitle'),
                description: t('uomGroupForm.toast.successMessage'),
                variant: 'default',
            });

            reset();
            onClose();
        } catch (err) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: err.message || t('global.toasts.errorMessage'),
                variant: 'destructive',
            });
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">
                {initialData ? t('uomGroupForm.title.edit') : t('uomGroupForm.title.add')}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>{t('uomGroupForm.fields.name')}</Label>
                    <Input {...register('name', {required: t('uomGroupForm.validation.name')})} />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        {t('global.cancel')}
                    </Button>
                    <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        {initialData ? t('global.update') : t('global.create')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UomGroupFormModal;
