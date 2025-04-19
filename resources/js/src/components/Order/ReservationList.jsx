import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSearchParams, Link} from 'react-router-dom';
import DataTable from 'react-data-table-component';
import {debounce} from 'lodash';
import {fetchStockReservationsTable} from '@/src/store/stockReservationsSlice';
import BackButton from '@/src/components/common/BackButton.jsx';
import {Button} from '@/components/ui/button.jsx';

const ReservationList = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');

    const {dataTable: reservations, loading, error} = useSelector(state => state.stockReservations);

    useEffect(() => {
        dispatch(fetchStockReservationsTable(orderId ? {order_id: orderId} : {}));
    }, [dispatch, orderId]);

    const columns = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.stock?.product?.name || 'N/A',
            sortable: true,
        },
        {
            name: 'Warehouse',
            selector: row => row.stock?.warehouse?.name || 'N/A',
            sortable: true,
        },
        {
            name: 'Qty Reserved',
            selector: row => `${row.input_quantity ?? '-'} ${row.uom?.symbol || ''}`,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status || 'N/A',
            sortable: true,
        },
        {
            name: 'Order No.',
            selector: row => row.order?.order_number || '',
            cell: row => (
                <Link
                    to={`/orders/${row.order?.id}`}
                    className="text-blue-600 hover:underline font-medium"
                >
                    {row.order?.order_number || 'N/A'}
                </Link>
            ),
            sortable: true,
        },
    ], []);

    const handleRefresh = useMemo(() => debounce(() => {
        dispatch(fetchStockReservationsTable(orderId ? {order_id: orderId} : {}));
    }, 300), [dispatch, orderId]);

    useEffect(() => {
        return () => handleRefresh.cancel();
    }, [handleRefresh]);

    return (
        <div className="p-6 bg-white rounded shadow-md mx-auto max-w-6xl">
            <div className="mb-4">
                <BackButton/>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {orderId
                        ? `Reservations for Order #${orderId}`
                        : 'All Stock Reservations'}
                </h2>
                <Button onClick={handleRefresh} variant="outline">
                    🔄 Refresh
                </Button>
            </div>

            {error && (
                <div className="text-sm text-red-700 bg-red-100 px-4 py-3 rounded border border-red-300 mb-4">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <DataTable
                columns={columns}
                data={reservations}
                progressPending={loading}
                pagination
                highlightOnHover
                striped
                persistTableHead
                noDataComponent={
                    <div className="text-gray-500 text-center text-sm py-4">
                        No reservations found.
                    </div>
                }
                className="border rounded"
            />
        </div>
    );
};

export default ReservationList;
