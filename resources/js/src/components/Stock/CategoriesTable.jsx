import React, {useEffect, useState, useMemo, useCallback} from "react";
import DataTable from "react-data-table-component";
import {Button} from "@/Components/ui/button";
import {FaPlus, FaSearch} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategoriesTable, removeCategory} from "@/src/store/categorySlice.jsx";
import {useTranslation} from "react-i18next";
import CategoryFormModal from "@/src/components/Stock/CategoryFormModal.jsx"

const CategoriesTable = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const categoriesTable = useSelector((state) => state.categories.dataTable || []);
    const loading = useSelector((state) => state.categories.loading);
    const currentLang = useSelector((state) => state.language.current);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    useEffect(() => {
        dispatch(fetchCategoriesTable());
    }, [dispatch]);

    const filteredBundles = useMemo(() => {
        return categoriesTable.filter((category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categoriesTable, searchTerm]);

    const handleEdit = useCallback((category) => {
        setEditCategory(category);
        setShowForm(true);
    }, []);

    const handleDelete = useCallback((id) => {
        if (window.confirm(t('categories.confirmDelete'))) {
            dispatch(removeCategory({id: id}))
        }
    }, [dispatch]);

    const handleCloseForm = useCallback(() => {
        setShowForm(false);
        setEditCategory(null);
        dispatch(fetchCategoriesTable());
    }, [dispatch]);

    const columns = useMemo(() => [
        {name: t('categories.columns.name'), selector: row => row.name, sortable: true},
        {name: t('categories.columns.description'), selector: row => row.description, sortable: true},
        {
            name: t('categories.columns.createdAt'),
            selector: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: t('categories.columns.actions'),
            cell: (row) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="warning" onClick={() => handleEdit(row)}>{t('global.edit')}</Button>
                    <Button size="sm" variant="destructive"
                            onClick={() => handleDelete(row.id)}>{t('global.delete')}</Button>
                </div>
            ),
        },
    ], [handleEdit, handleDelete]);

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full overflow-hidden">
            {/* Header Actions */}
            <div className="flex justify-between items-center px-8 py-6 border-b">
                <h2 className="text-xl font-semibold">{t('categories.title')}</h2>
                <div className="flex gap-3">
                    <Button onClick={() => dispatch(fetchCategoriesTable())} variant="outline">
                        🔄 {t('global.refresh')}
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                    >
                        <FaPlus/> {t('categories.actions.add')}
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 px-8 py-4 bg-gray-50">
                <FaSearch className="text-gray-400"/>
                <input
                    type="text"
                    placeholder={t('categories.placeholders.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
                />
            </div>

            {/* DataTable */}
            <div className="w-full overflow-x-auto">
                <div className="w-full">
                    <DataTable
                        key={currentLang}
                        columns={columns}
                        data={filteredBundles}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        className="border rounded-none shadow-sm w-full"
                    />
                </div>
            </div>

            {showForm && (
                <CategoryFormModal showModal={showForm} onClose={handleCloseForm}
                                   initialData={editCategory}/>
            )}
        </div>
    );
};

export default CategoriesTable;
