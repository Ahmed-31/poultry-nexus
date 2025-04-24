import React, {useEffect, useState, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchUomGroupsTable, removeUomGroup} from "@/src/store/uomGroupSlice.jsx";
import DataTable from "react-data-table-component";
import {Button} from "@/components/ui/button";
import {FaPlus} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import UomGroupFormModal from "@/src/components/Stock/Uom/FormModals/UomGroupFormModal.jsx";

const UomGroupTable = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const uomGroupsTable = useSelector((state) => state.uomGroups.dataTable || []);
    const loading = useSelector((state) => state.uomGroups.loading);
    const currentLang = useSelector((state) => state.language.current);

    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editGroup, setEditGroup] = useState(null);

    useEffect(() => {
        dispatch(fetchUomGroupsTable());
    }, [dispatch]);

    const filteredGroups = useMemo(() => {
        return uomGroupsTable.filter((group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, uomGroupsTable]);

    const handleEdit = (group) => {
        setEditGroup(group);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm(t('uomGroupTable.confirmDelete'))) {
            dispatch(removeUomGroup({id}));
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditGroup(null);
        dispatch(fetchUomGroupsTable());
    };

    const columns = useMemo(() => [
        {
            name: t('uomGroupTable.tableHeaders.name'),
            selector: (row) => t(`uomGroups.${row.name}`),
            sortable: true,
        },
        {
            name: t('uomGroupTable.tableHeaders.createdAt'),
            selector: (row) => new Date(row.created_at).toLocaleString(),
            sortable: true,
        },
        {
            name: t('uomGroupTable.tableHeaders.actions'),
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>{t('global.edit')}</Button>
                    <Button variant="destructive" onClick={() => handleDelete(row.id)}>{t('global.delete')}</Button>
                </div>
            ),
        },
    ], [t, currentLang]);

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            <div className="flex justify-between items-center px-8 py-6 gap-4 flex-wrap">
                <h2 className="text-3xl font-bold text-gray-800">📦 {t('uomGroupTable.title')}</h2>
                <div className="flex gap-3">
                    <Button onClick={() => dispatch(fetchUomGroupsTable())} variant="outline">
                        🔄 {t('global.refresh')}
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                    >
                        <FaPlus className="mr-2"/> {t('uomGroupTable.addGroup')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder={"🔍 " + t('uomGroupTable.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                />
            </div>

            <div className="w-full overflow-x-auto">
                <div className="w-full">
                    <DataTable
                        key={currentLang}
                        columns={columns}
                        data={filteredGroups}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        className="border rounded-none shadow-sm w-full"
                    />
                </div>
            </div>

            {showForm && (
                <UomGroupFormModal showModal={showForm} onClose={handleCloseForm} initialData={editGroup}/>
            )}
        </div>
    );
};

export default UomGroupTable;
