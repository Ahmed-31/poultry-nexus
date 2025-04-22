import React, {useEffect, useState, useMemo, useCallback} from "react";
import DataTable from "react-data-table-component";
import {Button} from "@/Components/ui/button";
import {FaPlus, FaSearch} from "react-icons/fa";
import ExpandedBundleProducts from "@/src/components/Stock/ExpandedBundleProducts";
import {useDispatch, useSelector} from "react-redux";
import {fetchProductBundlesTable, removeProductBundle} from "@/src/store/productBundlesSlice.jsx";
import ProductBundleFormModal from "@/src/components/Stock/ProductBundleFormModal.jsx";
import {useTranslation} from "react-i18next";

const ProductBundlesTable = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const bundles = useSelector((state) => state.productBundles.dataTable || []);
    const loading = useSelector((state) => state.productBundles.loading);
    const currentLang = useSelector((state) => state.language.current);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editBundle, setEditBundle] = useState(null);

    useEffect(() => {
        dispatch(fetchProductBundlesTable());
    }, [dispatch]);

    const filteredBundles = useMemo(() => {
        return bundles.filter((bundle) =>
            bundle.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bundles, searchTerm]);

    const handleEdit = useCallback((bundle) => {
        setEditBundle(bundle);
        setShowForm(true);
    }, []);

    const handleDelete = useCallback((id) => {
        if (window.confirm(t('productBundles.confirmDelete'))) {
            dispatch(removeProductBundle({id: id}))
        }
    }, [dispatch]);

    const handleCloseForm = useCallback(() => {
        setShowForm(false);
        setEditBundle(null);
        dispatch(fetchProductBundlesTable());
    }, [dispatch]);

    const columns = useMemo(() => [
        {name: t('productBundles.columns.name'), selector: row => row.name, sortable: true},
        {name: t('productBundles.columns.description'), selector: row => row.description, sortable: true},
        {
            name: t('productBundles.columns.createdAt'),
            selector: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: t('productBundles.columns.actions'),
            cell: (row) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="warning" onClick={() => handleEdit(row)}>{t('global.edit')}</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(row.id)}>{t('global.delete')}</Button>
                </div>
            ),
        },
    ], [handleEdit, handleDelete]);

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full overflow-hidden">
            {/* Header Actions */}
            <div className="flex justify-between items-center px-8 py-6 border-b">
                <h2 className="text-xl font-semibold">{t('productBundles.title')}</h2>
                <div className="flex gap-3">
                    <Button onClick={() => dispatch(fetchProductBundlesTable())} variant="outline">
                        🔄 {t('global.refresh')}
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                    >
                        <FaPlus/> {t('productBundles.actions.add')}
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 px-8 py-4 bg-gray-50">
                <FaSearch className="text-gray-400"/>
                <input
                    type="text"
                    placeholder={t('productBundles.placeholders.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
                />
            </div>

            {/* DataTable */}
            <div className="px-8 pb-8">
                <DataTable
                    key={currentLang}
                    columns={columns}
                    data={filteredBundles}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    striped
                    className="rounded-xl overflow-hidden"
                    expandableRows
                    expandableRowsComponent={ExpandedBundleProducts}
                />
            </div>

            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
                        <ProductBundleFormModal showModal={showForm} onClose={handleCloseForm}
                                                initialData={editBundle}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductBundlesTable;
