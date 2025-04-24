import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchUomDimensionsTable, removeUomDimensionItem} from "@/src/store/uomDimensionsSlice.jsx";
import DataTable from "react-data-table-component";
import {Button} from "@/components/ui/button";
import {FaPlus} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import DimensionFormModal from "@/src/components/Stock/Uom/FormModals/DimensionFormModal.jsx";

const DimensionTable = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const dimensions = useSelector((state) => state.uomDimensions.dataTable || []);
    const loading = useSelector((state) => state.uomDimensions.loading);
    const currentLang = useSelector((state) => state.language.current);

    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editDimension, setEditDimension] = useState(null);

    useEffect(() => {
        dispatch(fetchUomDimensionsTable());
    }, [dispatch]);

    const filteredDimensions = useMemo(() => {
        return dimensions.filter((d) =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, dimensions]);

    const handleEdit = (dimension) => {
        setEditDimension(dimension);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm(t("dimensionTable.confirmDelete"))) {
            dispatch(removeUomDimensionItem({id}));
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditDimension(null);
        dispatch(fetchUomDimensionsTable());
    };

    const columns = useMemo(() => [
        {
            name: t("dimensionTable.tableHeaders.name"),
            selector: (row) => t(`dimensions.${row.name}`),
            sortable: true,
        },
        {
            name: t("dimensionTable.tableHeaders.uom"),
            selector: (row) =>
                row.uom ? `${t(`uoms.${row.uom.name}`)} (${row.uom.symbol})` : t("global.na"),
            sortable: true,
        },
        {
            name: t("dimensionTable.tableHeaders.products"),
            selector: (row) => row.products?.length || 0,
            sortable: true,
        },
        {
            name: t("dimensionTable.tableHeaders.createdAt"),
            selector: (row) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: t("dimensionTable.tableHeaders.actions"),
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>{t("global.edit")}</Button>
                    <Button variant="destructive" onClick={() => handleDelete(row.id)}>{t("global.delete")}</Button>
                </div>
            ),
        },
    ], [t, currentLang]);

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            <div className="flex justify-between items-center px-8 py-6 gap-4 flex-wrap">
                <h2 className="text-3xl font-bold text-gray-800">📏 {t("dimensionTable.title")}</h2>
                <div className="flex gap-3">
                    <Button onClick={() => dispatch(fetchDimensionsTable())} variant="outline">
                        🔄 {t("global.refresh")}
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                    >
                        <FaPlus className="mr-2"/> {t("dimensionTable.addDimension")}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder={"🔍 " + t("dimensionTable.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                />
            </div>

            <div className="w-full overflow-x-auto">
                <DataTable
                    key={currentLang}
                    columns={columns}
                    data={filteredDimensions}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    striped
                    className="border rounded-none shadow-sm w-full"
                />
            </div>

            {showForm && (
                <DimensionFormModal showModal={showForm} onClose={handleCloseForm} initialData={editDimension}/>
            )}
        </div>
    );
};

export default DimensionTable;
