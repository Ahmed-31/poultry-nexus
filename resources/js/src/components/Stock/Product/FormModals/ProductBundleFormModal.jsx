import React, {useEffect} from 'react';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import {Button} from '@/Components/ui/button.jsx';
import {Input} from '@/Components/ui/input.jsx';
import {Label} from '@/Components/ui/label.jsx';
import Modal from '@/src/components/common/Modal.jsx';
import {SmartSelect} from '@/src/components/common/SmartSelect.jsx';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts} from '@/src/store/productsSlice.jsx';
import {fetchUoms} from '@/src/store/uomSlice.jsx';
import {addProductBundle, editProductBundle} from '@/src/store/productBundlesSlice.jsx';
import {useTranslation} from 'react-i18next';
import {toast} from '@/hooks/use-toast.js';
import VisualFormulaBuilder from "@/src/components/common/VisualFormulaBuilder.jsx";

const ProductBundleFormModal = ({showModal, onClose, initialData = null}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.list || []);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: {errors},
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            parameters: [],
            products: []
        }
    });

    const {fields: parameterFields, append: appendParameter, remove: removeParameter} = useFieldArray({
        control,
        name: 'parameters'
    });

    const {fields: productFields, append: appendProduct, remove: removeProduct} = useFieldArray({
        control,
        name: 'products'
    });

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchUoms());
    }, [dispatch]);

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const availableParameterNames = watch('parameters')?.map(p => p.name) || [];

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                await dispatch(editProductBundle({id: initialData.id, productBundle: data})).unwrap();
            } else {
                await dispatch(addProductBundle({productBundle: data})).unwrap();
                reset();
            }
            toast({title: t('global.toasts.successTitle'), description: t('productBundleForm.toast.successMessage')});
            onClose();
        } catch (err) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: err.message || t('global.toasts.errorMessage'),
                variant: "destructive"
            });
        }
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">{initialData ? t('productBundleForm.title.edit') : t('productBundleForm.title.add')}</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* General Info */}
                <div className="space-y-4">
                    <div>
                        <Label>{t('productBundleForm.fields.name')}</Label>
                        <Input {...register('name', {required: t('global.required')})} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label>{t('productBundleForm.fields.description')}</Label>
                        <textarea
                            {...register('description')}
                            className="border p-2 w-full rounded-md"
                        />
                    </div>
                </div>

                {/* Bundle Parameters */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold">{t('productBundleForm.fields.parameters')}</h3>
                        <Button type="button" onClick={() => appendParameter({
                            name: '',
                            label: '',
                            type: 'number',
                            default_value: ''
                        })}>
                            + {t('global.add')}
                        </Button>
                    </div>

                    {parameterFields.map((param, index) => (
                        <div key={param.id} className="grid grid-cols-4 gap-4 items-center">

                            {/* Parameter Name */}
                            <Input
                                placeholder={t('productBundleForm.placeholders.parameter_variable')}
                                {...register(`parameters.${index}.name`, {required: true})}
                            />

                            {/* Parameter Type (select number/text/select) */}
                            <Controller
                                name={`parameters.${index}.type`}
                                control={control}
                                defaultValue="number"
                                render={({field}) => (
                                    <SmartSelect
                                        multiple={false}
                                        options={[
                                            {value: 'number', label: t('productBundleForm.types.number')},
                                            {value: 'text', label: t('productBundleForm.types.text')},
                                            {value: 'select', label: t('productBundleForm.types.select')},
                                        ]}
                                        selected={field.value}
                                        onChange={field.onChange}
                                        placeholder={t('productBundleForm.selectType')}
                                    />
                                )}
                            />

                            {/* Default Value */}
                            <Input
                                placeholder={t('productBundleForm.placeholders.parameter_default_value')}
                                {...register(`parameters.${index}.default_value`)}
                            />

                            {/* Remove Parameter Button */}
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => removeParameter(index)}
                                className="text-red-500"
                            >
                                {t('global.remove')}
                            </Button>

                        </div>
                    ))}

                </div>

                {/* Products */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold">{t('productBundleForm.fields.products')}</h3>
                        <Button type="button" onClick={() => appendProduct({
                            product_id: '',
                        })}>
                            + {t('global.add')}
                        </Button>
                    </div>

                    {productFields.map((item, index) => {
                        return (
                            <div key={item.id} className="space-y-4 border p-4 rounded-lg">
                                {/* Product Selector */}
                                <div>
                                    <Label>{t('productBundleForm.fields.product')}</Label>
                                    <Controller
                                        name={`products.${index}.product_id`}
                                        control={control}
                                        rules={{required: t('global.required')}}
                                        render={({field}) => (
                                            <SmartSelect
                                                multiple={false}
                                                options={products.map(p => ({
                                                    value: p.id,
                                                    label: p.name,
                                                }))}
                                                selected={field.value}
                                                onChange={field.onChange}
                                                placeholder={t('productBundleForm.placeholders.product')}
                                            />
                                        )}
                                    />
                                </div>

                                <Label>{t('formulaBuilder.title')}</Label>
                                <VisualFormulaBuilder
                                    control={control}
                                    name={`products.${index}.formula_blocks`}
                                    parameters={watch('parameters') || []}
                                    products={products}
                                />
                                <Button type="button" variant="ghost" onClick={() => removeProduct(index)}
                                        className="text-red-500">
                                    {t('global.remove')}
                                </Button>

                                {/* Helper: List of Available Parameters */}
                                {availableParameterNames.length > 0 && (
                                    <div className="bg-gray-100 p-2 rounded-md mt-4 text-xs">
                                        <strong>{t('productBundleForm.fields.available_parameters')}:</strong> {availableParameterNames.join(', ')}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-2 mt-6">
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

export default ProductBundleFormModal;
