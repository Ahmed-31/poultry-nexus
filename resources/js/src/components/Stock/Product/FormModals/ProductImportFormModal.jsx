import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {uploadProducts} from '@/src/store/productsSlice';
import {Button} from '@/Components/ui/button.jsx';
import {Input} from '@/Components/ui/input.jsx';
import {Select, SelectTrigger, SelectContent, SelectValue, SelectItem} from '@/Components/ui/select.jsx';
import Modal from '@/src/components/common/Modal.jsx';
import {toast} from '@/hooks/use-toast.js';
import {useTranslation} from 'react-i18next';
import * as XLSX from 'xlsx';

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

    const handleDownloadSample = () => {
        const isArabic = lang === 'ar';

        const sampleData = [
            {
                [isArabic ? 'الاسم' : 'Name']: isArabic ? 'منتج تجريبي' : 'Sample product',
                [isArabic ? 'وحدة القياس' : 'Unit of Measure']: isArabic ? 'قطعة' : 'Piece',
                [isArabic ? 'الابعاد' : 'Dimensions']: isArabic ? 'طول * عرض' : 'length * width',
            },
            {
                [isArabic ? 'الاسم' : 'Name']: isArabic ? 'منتج ثاني' : 'Second product',
                [isArabic ? 'وحدة القياس' : 'Unit of Measure']: isArabic ? 'علبة' : 'Box',
                [isArabic ? 'الابعاد' : 'Dimensions']: isArabic ? 'عرض * ارتفاع' : 'width * height',
            },
            {
                [isArabic ? 'الاسم' : 'Name']: isArabic ? 'منتج ثالث' : 'Third product',
                [isArabic ? 'وحدة القياس' : 'Unit of Measure']: isArabic ? 'علبة' : 'Box',
                [isArabic ? 'الابعاد' : 'Dimensions']: '',
            },
        ];

        const worksheet = XLSX.utils.json_to_sheet(sampleData);

        if (isArabic) {
            worksheet['!rtl'] = true;
        }

        const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({r: 0, c: C});
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = {
                font: {bold: true},
                fill: {
                    patternType: "solid",
                    fgColor: {rgb: "D9D9D9"},
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                }
            };
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array', cellStyles: true});

        const data = new Blob([excelBuffer], {type: 'application/octet-stream'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(data);
        link.download = isArabic ? 'منتج_تجريبي.xlsx' : 'sample_products.xlsx';
        link.click();
    };

    return (
        <Modal isOpen={showModal} onClose={onClose}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{t('productImport.title')}</h2>
                <Button type="button" onClick={handleDownloadSample}
                        className="bg-green-500 text-white px-3 py-1 rounded-md">
                    {t('productImport.downloadSample')}
                </Button>
            </div>

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
