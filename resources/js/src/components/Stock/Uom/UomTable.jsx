import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchUomsTable, removeUomItem} from "@/src/store/uomSlice.jsx";
import DataTable from "react-data-table-component";
import {Button} from "@/Components/ui/button";
import {FaPlus} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import ExpandedUomDetails from "@/src/components/Stock/Uom/Expanded/ExpandedUomDetails.jsx";
import UomFormModal from "@/src/components/Stock/Uom/FormModals/UomFormModal.jsx";

const UomTable = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const uomsTable = useSelector((state) => state.uoms.dataTable || []);
    const loading = useSelector((state) => state.uoms.loading);
    const currentLang = useSelector((state) => state.language.current);

    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editUom, setEditUom] = useState(null);

    useEffect(() => {
        dispatch(fetchUomsTable());
    }, [dispatch]);

    const filteredUoms = useMemo(() => {
        return uomsTable
            .filter((uom) =>
                uom.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm, uomsTable]);

    const handleEdit = (uom) => {
        setEditUom(uom);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm(t('uomTable.confirmDelete'))) {
            dispatch(removeUomItem({id: id}));
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditUom(null);
        dispatch(fetchUomsTable());
    };

    const columns = [
        {
            name: t('uomTable.tableHeaders.name'),
            selector: (row) => t(`uoms.${row.name}`),
            sortable: true,
        },
        {
            name: t('uomTable.tableHeaders.symbol'),
            selector: (row) => row.symbol,
            sortable: true,
        },
        {
            name: t('uomTable.tableHeaders.group'),
            selector: (row) => t(`uomGroups.${row.group?.name}`) || t('global.na'),
            sortable: true,
        },
        {
            name: t('uomTable.tableHeaders.isBase'),
            selector: (row) => row.is_base ? t('global.yes') : t('global.no'),
            sortable: true,
        },
        {
            name: t('uomTable.tableHeaders.conversionFactor'),
            selector: (row) => row.conversion_factor,
            sortable: true,
        },
        {
            name: t('uomTable.tableHeaders.dimensions'),
            selector: (row) => row.dimensions?.map(d => t(`dimensions.${d.name}`)).join(', ') || t('global.none'),
            sortable: false,
        },
        {
            name: t('uomTable.tableHeaders.products'),
            selector: (row) => row.products?.length || 0,
            sortable: true,
        },
        {
            name: t('uomTable.tableHeaders.actions'),
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
                <h2 className="text-3xl font-bold text-gray-800">📦 {t('uomTable.title')}</h2>
                <div className="flex gap-3">
                    <Button onClick={() => dispatch(fetchUomsTable())} variant="outline">
                        🔄 {t('global.refresh')}
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                    >
                        <FaPlus className="mr-2"/> {t('uomTable.addUom')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder={"🔍 " + t('uomTable.searchPlaceholder')}
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
                        data={filteredUoms}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        className="border rounded-none shadow-sm w-full"
                        expandableRows
                        expandableRowsComponent={ExpandedUomDetails}
                    />
                </div>
            </div>

            {showForm && (
                <UomFormModal showModal={showForm} onClose={handleCloseForm} initialData={editUom}/>
            )}
        </div>
    );
};

export default UomTable;
