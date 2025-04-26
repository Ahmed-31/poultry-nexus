import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {uploadProducts} from '@/src/store/productsSlice';
import {Button} from '@/Components/ui/button.jsx';
import {Input} from '@/Components/ui/input.jsx';
import {Select, SelectTrigger, SelectContent, SelectValue, SelectItem} from '@/Components/ui/select.jsx';
import Modal from '@/src/components/common/Modal.jsx';
import {toast} from '@/hooks/use-toast.js';
import {useTranslation} from 'react-i18next';

const ProductImportFormModal = ({showModal, onClose}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {uploading} = useSelector((state) => state.products || {});

    const [file, setFile] = useState(null);
    const [lang, setLang] = useState('en');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: t('productImport.toast.noFile'),
                variant: "destructive",
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('lang', lang);

        try {
            await dispatch(uploadProducts(formData)).unwrap();

            toast({
                title: t('global.toasts.successTitle'),
                description: t('productImport.toast.successMessage'),
                variant: "default",
            });

            setFile(null);
            setLang('en');
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
            <h2 className="text-lg font-bold mb-4">{t('productImport.title')}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">{t('productImport.fields.file')}</label>
                    <Input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files[0])}/>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">{t('productImport.fields.language')}</label>
                    <Select value={lang} onValueChange={setLang}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('productImport.placeholders.language')}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">{t('global.english')}</SelectItem>
                            <SelectItem value="ar">{t('global.arabic')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        {t('global.cancel')}
                    </Button>
                    <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={uploading}>
                        {uploading ? t('global.uploading') : t('productImport.uploadButton')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductImportFormModal;
