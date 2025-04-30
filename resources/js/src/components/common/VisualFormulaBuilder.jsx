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
        const base = {type: blockType, value: blockType === 'operator' ? '+' : ''};
        append(base);
    };

    const operatorOptions = [
        {value: '+', label: '+'},
        {value: '-', label: '-'},
        {value: '*', label: '×'},
        {value: '/', label: '÷'},
    ];

    const renderBlock = (field, index) => {
        const path = `${name}.${index}.value`;
        switch (field.type) {
            case 'parameter':
                return (
                    <Controller
                        name={path}
                        control={control}
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
                );
            case 'product':
                return (
                    <Controller
                        name={path}
                        control={control}
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
                );
            case 'constant':
                return (
                    <Controller
                        name={path}
                        control={control}
                        render={({field}) => (
                            <Input type="number" step="any" {...field} placeholder={t('formulaBuilder.enterConstant')} className="w-20 text-center"/>
                        )}
                    />
                );
            case 'operator':
                return (
                    <Controller
                        name={path}
                        control={control}
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
                );
            default:
                return null;
        }
    };

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

            <div className="flex flex-wrap items-center gap-2 border p-2 rounded bg-gray-50 min-h-[48px]">
                {fields.length === 0 && (
                    <div className="text-gray-400">{t('formulaBuilder.noBlocks')}</div>
                )}
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-1 bg-white px-2 py-1 border rounded shadow-sm">
                        {renderBlock(field, index)}
                        <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => remove(index)}
                            className="text-red-500 px-1"
                        >×</Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisualFormulaBuilder;
