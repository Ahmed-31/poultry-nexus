import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import DataTable from 'react-data-table-component';
import {Button} from '@/components/ui/button';
import OrderForm from './OrderForm.jsx';
import ExpandedOrderDetails from './ExpandedOrderDetails.jsx';
import DeleteConfirmationModal from '@/src/components/common/DeleteConfirmationModal.jsx';
import {fetchOrdersTable, removeOrder} from '@/src/store/ordersSlice';
import {toast} from "@/hooks/use-toast.js";
import {useTranslation} from "react-i18next";

const OrderActions = React.memo(({order, onEdit, onDelete}) => (
    <div className="flex flex-wrap gap-2">
        <Link
            to={`/orders/${order.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
        >
            View
        </Link>
        <Link
            to={`/stock/reservations?order_id=${order.id}`}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-xs"
        >
            Reservations
        </Link>
        <Button variant="warning" size="sm" onClick={() => onEdit(order)}>
            Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(order.id)}>
            Delete
        </Button>
    </div>
));

const OrderList = () => {
    const {t} = useTranslation();
    const PRIORITY_LABELS = useMemo(() => ({
        1: t('priority.1.label'),
        2: t('priority.2.label'),
        3: t('priority.3.label'),
        4: t('priority.4.label'),
        5: t('priority.5.label'),
    }), [t]);
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.dataTable || []);
    const loading = useSelector(state => state.orders.loading);

    const error = useSelector(state => state.orders.error);
    const [searchTerm, setSearchTerm] = useState('');
    const [formState, setFormState] = useState({show: false, mode: null, data: null});
    const [deleteState, setDeleteState] = useState({show: false, entityId: null});
    const getColumns = (handleEdit, handleDelete) => [
        {
            name: t('orderList.columns.orderNumber'),
            selector: row => row.order_number,
            sortable: true
        },
        {
            name: t('orderList.columns.customer'),
            selector: row => row.customer?.name || t('global.na'),
            sortable: true
        },
        {
            name: t('orderList.columns.status'),
            selector: row => row.status,
            sortable: true
        },
        {
            name: t('orderList.columns.priority'),
            selector: row => row.priority,
            sortable: true,
            cell: row => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.priority >= 4
                            ? 'bg-red-100 text-red-700'
                            : row.priority >= 2
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-700'
                    }`}
                >
                {PRIORITY_LABELS[row.priority] || t('global.na')}
            </span>
            )
        },
        {
            name: t('orderList.columns.actions'),
            cell: row => (
                <OrderActions
                    order={row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ),
            ignoreRowClick: true,
        }
    ];

    useEffect(() => {
        dispatch(fetchOrdersTable());
    }, [dispatch]);

    const handleEdit = useCallback(order => {
        setFormState({show: true, mode: 'edit', data: order});
    }, []);

    const handleDelete = useCallback(id => {
        setDeleteState({show: true, entityId: id});
    }, []);

    const confirmDelete = async () => {
        try {
            await dispatch(removeOrder({id: deleteState.entityId})).unwrap();
            dispatch(fetchOrdersTable());
            toast({
                title: t('global.toasts.successTitle'),
                description: t('orderList.toast.successMessage'),
                variant: "default",
            });
        } catch (e) {
            toast({
                title: t('global.toasts.errorTitle'),
                description: e.message || t('global.toasts.errorMessage'),
                variant: "destructive",
            });
        }
        setDeleteState({show: false, entityId: null});
    };

    const cancelDelete = () => {
        setDeleteState({show: false, entityId: null});
    };

    const handleCloseForm = () => {
        setFormState({show: false, mode: null, data: null});
        dispatch(fetchOrdersTable());
    };

    const filteredOrders = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return orders.filter(order =>
            order.order_number?.toLowerCase().includes(term) ||
            order.customer?.name?.toLowerCase().includes(term) ||
            order.status?.toLowerCase().includes(term)
        );
    }, [orders, searchTerm]);

    const columns = useMemo(() => getColumns(handleEdit, handleDelete), [handleEdit, handleDelete]);

    return (
        <div className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{t('orderList.title')}</h2>
                <div className="flex gap-2">
                    <Button onClick={() => dispatch(fetchOrdersTable())} variant="outline">
                        🔄 {t('global.refresh')}
                    </Button>
                    <Button
                        onClick={() => setFormState({show: true, mode: 'create', data: null})}
                        className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white"
                    >
                        {t('orderList.buttons.create')}
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder={t('orderList.search.placeholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded shadow-sm text-sm"
                />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <DataTable
                columns={columns}
                data={filteredOrders}
                progressPending={loading}
                pagination
                highlightOnHover
                striped
                responsive
                persistTableHead
                expandableRows
                expandableRowsComponent={ExpandedOrderDetails}
                noDataComponent={
                    <p className="text-center text-gray-500">
                        {searchTerm ? t('orderList.noResults.filtered') : t('orderList.noResults.empty')}
                    </p>
                }
                className="border rounded shadow-sm"
            />

            {formState.mode && (
                <OrderForm
                    showModal={formState.show}
                    onClose={handleCloseForm}
                    initialData={formState.mode === 'edit' ? formState.data : null}
                />
            )}

            <DeleteConfirmationModal
                showModal={deleteState.show}
                entityName="Order"
                entityId={deleteState.entityId}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default OrderList;
