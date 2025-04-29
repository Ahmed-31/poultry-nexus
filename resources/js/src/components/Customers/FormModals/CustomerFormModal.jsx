import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useForm, Controller} from "react-hook-form";
import {useDispatch} from "react-redux";
import {createCustomer, editCustomer} from "@/src/store/customersSlice.jsx";
import Modal from "@/src/components/common/Modal.jsx";
import {toast} from "@/hooks/use-toast.js";
import {useTranslation} from "react-i18next";

const CustomerFormModal = ({showModal, onClose, initialData = null}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        control,
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            type: 'domestic',
            ...initialData
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                address: initialData.address || "",
                type: initialData.type || "domestic",
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                await dispatch(editCustomer({id: initialData.id, customer: data})).unwrap();
            } else {
                await dispatch(createCustomer({customer: data})).unwrap();
            }

            toast({
                title: t('global.toasts.successTitle'),
                description: t('customerForm.toast.successMessage'),
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
            <h2 className="text-lg font-bold mb-4">{initialData ? t('customerForm.title.edit') : t('customerForm.title.add')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>{t("customerForm.fields.name")}</Label>
                    <Input {...register("name", {required: t('customerForm.validation.name')})} />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>{t("customerForm.fields.email")}</Label>
                    <Input {...register("email")} />
                </div>

                <div>
                    <Label>{t("customerForm.fields.phone")}</Label>
                    <Input {...register("phone")} />
                </div>

                <div>
                    <Label>{t("customerForm.fields.address")}</Label>
                    <Input {...register("address")} />
                </div>

                <div>
                    <Label>{t("customerForm.fields.type")}</Label>
                    <Controller
                        control={control}
                        name="type"
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("customerForm.placeholders.type")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="domestic">{t("customerTypes.domestic")}</SelectItem>
                                    <SelectItem value="international">{t("customerTypes.international")}</SelectItem>
                                </SelectContent>
                            </Select>
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

export default CustomerFormModal;
