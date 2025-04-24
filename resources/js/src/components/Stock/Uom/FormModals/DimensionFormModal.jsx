import React, {useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Modal from '@/src/components/common/Modal.jsx';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {toast} from '@/hooks/use-toast';
import {addUomDimensionItem, updateUomDimensionItem} from '@/src/store/uomDimensionsSlice.jsx';
import {fetchUoms} from '@/src/store/uomSlice.jsx';

const DimensionFormModal = ({showModal, onClose, initialData = null}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const uoms = useSelector((state) => state.uoms.list || []);

    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        reset,
    } = useForm({
        defaultValues: {
            name: '',
            uom_id: '',
        },
    });

    useEffect(() => {
        dispatch(fetchUoms());
    }, [dispatch]);

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || '',
                uom_id: initialData.uom_id?.toString() || '',
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {...data, uom_id: parseInt(data.uom_id)};

            if (initialData) {
                await dispatch(updateUomDimensionItem({id: initialData.id, data: payload})).unwrap();
            } else {
                await dispatch(addUomDimensionItem({data: payload})).unwrap();
            }

            toast({
                title: t('global.toasts.successTitle'),
                description: t('dimensionForm.toast.successMessage'),
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
                {initialData ? t('dimensionForm.title.edit') : t('dimensionForm.title.add')}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>{t('dimensionForm.fields.name')}</Label>
                    <Input {...register('name', {required: t('dimensionForm.validation.name')})} />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>{t('dimensionForm.fields.uom')}</Label>
                    <Controller
                        control={control}
                        name="uom_id"
                        rules={{required: t('dimensionForm.validation.uom')}}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('dimensionForm.placeholders.uom')}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {uoms.map((uom) => (
                                        <SelectItem key={uom.id} value={uom.id.toString()}>
                                            {t(`uoms.${uom.name}`)} ({uom.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.uom_id && <p className="text-red-500 text-xs mt-1">{errors.uom_id.message}</p>}
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

export default DimensionFormModal;
