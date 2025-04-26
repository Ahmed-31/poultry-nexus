import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchProductsTable, removeProduct} from "@/src/store/productsSlice.jsx";
import DataTable from "react-data-table-component";
import {Button} from "@/Components/ui/button.jsx";
import {FaPlus} from "react-icons/fa";
import ItemFormModal from "@/src/components/Stock/Product/FormModals/ItemFormModal.jsx";
import ExpandedProductDetails from "@/src/components/Stock/Product/Expanded/ExpandedProductDetails.jsx";
import {useTranslation} from "react-i18next";
import ProductImportFormModal from "@/src/components/Stock/Product/FormModals/ProductImportFormModal.jsx";

const ProductManagement = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.dataTable || []);
    const loading = useSelector((state) => state.products.loading);
    const currentLang = useSelector((state) => state.language.current);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showImportForm, setShowImportForm] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    const [selectedType, setSelectedType] = useState("");

    useEffect(() => {
        dispatch(fetchProductsTable());
    }, [dispatch]);

    const filteredProducts = useMemo(() => {
        return products
            .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((product) => (selectedCategory ? product.category.id === selectedCategory : true))
            .filter((product) => (selectedType ? product.type === selectedType : true));
    }, [products, searchTerm, selectedCategory, selectedType]);

    const handleEdit = (order) => {
        setEditOrder(order);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm(t('productManagement.confirmDelete'))) {
            dispatch(removeProduct(id));
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditOrder(null);
        dispatch(fetchProductsTable());
    };

    const columns = [
        {name: t('productManagement.tableHeaders.sku'), selector: (row) => row.sku, sortable: true},
        {name: t('productManagement.tableHeaders.name'), selector: (row) => row.name, sortable: true},
        {
            name: t('productManagement.tableHeaders.category'),
            selector: (row) => row.category?.name || t('global.na'),
            sortable: true
        },
        {name: t('productManagement.tableHeaders.type'), selector: (row) => t(`categoriesNames.${row.type}`), sortable: true},
        {name: t('productManagement.tableHeaders.unit'), selector: (row) => t(`uoms.${row.unit}`), sortable: true},
        {
            name: t('productManagement.tableHeaders.dimensions'),
            selector: (row) => {
                if (!row.dimensionsString || row.dimensionsString === '-') {
                    return t('dimensions.-');
                }

                return row.dimensionsString
                    .split(' x ')
                    .map(dim => t(`dimensions.${dim.trim()}`))
                    .join(' × ');
            },
            sortable: true,
        },
        {name: t('productManagement.tableHeaders.price'), selector: (row) => row.price, sortable: true},
        {
            name: t('productManagement.tableHeaders.actions'),
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>{t('global.edit')}</Button>
                    <Button variant="destructive" onClick={() => handleDelete(row.id)}>{t('global.delete')}</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            <div className="flex justify-between items-center px-8 py-6 gap-4 flex-wrap">
                <h2 className="text-3xl font-bold text-gray-800">📦 {t('productManagement.title')}</h2>
                <div className="flex gap-3">
                    <Button onClick={() => dispatch(fetchProductsTable())} variant="outline">
                        🔄 {t('global.refresh')}
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                    >
                        <FaPlus className="mr-2"/> {t('productManagement.addProduct')}
                    </Button>
                    <Button
                        onClick={() => setShowImportForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-green-600 text-white flex items-center font-medium"
                    >
                        📥 {t('productManagement.importProducts')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder={"🔍 " + t('productManagement.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                >
                    <option value="">All Categories</option>
                    <option value="1">Electronics</option>
                    <option value="2">Raw Materials</option>
                </select>

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                >
                    <option value="">All Types</option>
                    <option value="raw_material">Raw Material</option>
                    <option value="component">Component</option>
                    <option value="consumable">Consumable</option>
                </select>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="w-full">
                    <DataTable
                        key={currentLang}
                        columns={columns}
                        data={filteredProducts}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        className="border rounded-none shadow-sm w-full"
                        expandableRows
                        expandableRowsComponent={ExpandedProductDetails}
                    />
                </div>
            </div>

            {showForm && (
                <ItemFormModal showModal={showForm} onClose={handleCloseForm} initialData={editOrder}/>
            )}

            {showImportForm && (
                <ProductImportFormModal showModal={showImportForm} onClose={() => setShowImportForm(false)}/>
            )}
        </div>
    );
};

export default ProductManagement;
