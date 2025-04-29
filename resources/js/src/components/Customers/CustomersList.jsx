import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchCustomersTable} from "@/src/store/customersSlice";
import DataTable from "react-data-table-component";
import {Button} from "@/components/ui/button";
import {FaPlus, FaEdit} from "react-icons/fa";
import CustomerFormModal from "@/src/components/Customers/FormModals/CustomerFormModal.jsx";
import {useTranslation} from "react-i18next";

const CustomerList = () => {
    const dispatch = useDispatch();
    const customers = useSelector(state => state.customers.dataTable || []);
    const loading = useSelector(state => state.customers.loading);
    const currentLang = useSelector(state => state.language.current);

    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(fetchCustomersTable());
    }, [dispatch]);

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const name = customer.name?.toLowerCase() || "";
            const email = customer.email?.toLowerCase() || "";
            return (
                name.includes(searchTerm.toLowerCase()) ||
                email.includes(searchTerm.toLowerCase())
            );
        });
    }, [customers, searchTerm]);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditItem(null);
        dispatch(fetchCustomersTable());
    };

    const columns = [
        {
            name: t('customerList.columns.name'),
            selector: row => row.name ?? "-",
            sortable: true,
        },
        {
            name: t('customerList.columns.email'),
            selector: row => row.email ?? "-",
            sortable: true,
        },
        {
            name: t('customerList.columns.phone'),
            selector: row => row.phone ?? "-",
            sortable: true,
        },
        {
            name: t('customerList.columns.address'),
            selector: row => row.address ?? "-",
            sortable: true,
            grow: 2,
        },
        {
            name: t('customerList.columns.type'),
            selector: row => t(`customerTypes.${row.type}`) ?? "-",
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <Button variant="warning" onClick={() => handleEdit(row)} className="flex items-center gap-1">
                    <FaEdit/> {t('customerList.columns.edit')}
                </Button>
            ),
            ignoreRowClick: true,
            allowoverflow: true,
            button: "true",
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center px-8 py-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    👤 {t('customerList.title')}
                </h2>
                <div className="flex gap-2">
                    <Button onClick={() => dispatch(fetchCustomersTable())} variant="outline">
                        🔄 {t('global.refresh')}
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-all"
                    >
                        <FaPlus/> {t('customerList.buttons.add')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-8">
                <input
                    type="text"
                    placeholder={"🔍 " + t('customerList.filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Table */}
            <div className="px-8 pb-8">
                <DataTable
                    key={currentLang}
                    columns={columns}
                    data={filteredCustomers}
                    progressPending={loading}
                    pagination
                    striped
                    highlightOnHover
                    responsive
                    persistTableHead
                    className="rounded-lg border shadow-sm"
                />
            </div>

            {showForm && (
                <CustomerFormModal showModal={showForm} onClose={handleCloseForm} initialData={editItem}/>
            )}
        </div>
    );
};

export default CustomerList;
