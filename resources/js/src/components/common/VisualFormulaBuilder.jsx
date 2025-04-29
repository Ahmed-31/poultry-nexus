import React from 'react';
import {Controller, useFieldArray} from 'react-hook-form';
import {Input} from '@/Components/ui/input.jsx';
import {Button} from '@/Components/ui/button.jsx';
import {SmartSelect} from '@/src/components/common/SmartSelect.jsx';
import {useTranslation} from 'react-i18next';

const VisualFormulaBuilder = ({control, name, parameters = [], products = []}) => {
    const {t} = useTranslation();
    const {fields, append, remove} = useFieldArray({
        control,
        name,
    });

    const addBlock = (blockType) => {
        switch (blockType) {
            case 'parameter':
                append({type: 'parameter', value: ''});
                break;
            case 'product':
                append({type: 'product', value: ''});
                break;
            case 'constant':
                append({type: 'constant', value: ''});
                break;
            case 'operator':
                append({type: 'operator', value: '+'});
                break;
            default:
                break;
        }
    };

    const operatorOptions = [
        {value: '+', label: '+'},
        {value: '-', label: '-'},
        {value: '*', label: '×'},
        {value: '/', label: '÷'},
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
                <Button type="button" onClick={() => addBlock('parameter')} variant="outline">
                    + {t('formulaBuilder.addParameter')}
                </Button>
                <Button type="button" onClick={() => addBlock('product')} variant="outline">
                    + {t('formulaBuilder.addProduct')}
                </Button>
                <Button type="button" onClick={() => addBlock('constant')} variant="outline">
                    + {t('formulaBuilder.addConstant')}
                </Button>
                <Button type="button" onClick={() => addBlock('operator')} variant="outline">
                    + {t('formulaBuilder.addOperator')}
                </Button>
            </div>

            {fields.length === 0 && (
                <div className="text-gray-400">{t('formulaBuilder.noBlocks')}</div>
            )}

            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        {field.type === 'parameter' && (
                            <Controller
                                name={`${name}.${index}.value`}
                                control={control}
                                rules={{required: true}}
                                render={({field}) => (
                                    <SmartSelect
                                        multiple={false}
                                        options={parameters.map(p => ({
                                            value: p.name,
                                            label: p.translations?.ar || p.name,
                                        }))}
                                        selected={field.value}
                                        onChange={field.onChange}
                                        placeholder={t('formulaBuilder.selectParameter')}
                                    />
                                )}
                            />
                        )}

                        {field.type === 'product' && (
                            <Controller
                                name={`${name}.${index}.value`}
                                control={control}
                                rules={{required: true}}
                                render={({field}) => (
                                    <SmartSelect
                                        multiple={false}
                                        options={products.map(p => ({
                                            value: `quantity_product_${p.id}`,
                                            label: p.name,
                                        }))}
                                        selected={field.value}
                                        onChange={field.onChange}
                                        placeholder={t('formulaBuilder.selectProduct')}
                                    />
                                )}
                            />
                        )}

                        {field.type === 'constant' && (
                            <Controller
                                name={`${name}.${index}.value`}
                                control={control}
                                rules={{required: true}}
                                render={({field}) => (
                                    <Input
                                        type="number"
                                        step="any"
                                        {...field}
                                        placeholder={t('formulaBuilder.enterConstant')}
                                    />
                                )}
                            />
                        )}

                        {field.type === 'operator' && (
                            <Controller
                                name={`${name}.${index}.value`}
                                control={control}
                                rules={{required: true}}
                                render={({field}) => (
                                    <SmartSelect
                                        multiple={false}
                                        options={operatorOptions}
                                        selected={field.value}
                                        onChange={field.onChange}
                                        placeholder={t('formulaBuilder.selectOperator')}
                                    />
                                )}
                            />
                        )}

                        <Button type="button" variant="ghost" onClick={() => remove(index)} className="text-red-500">
                            {t('global.remove')}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisualFormulaBuilder;
