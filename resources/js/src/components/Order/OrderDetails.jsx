import React, {useEffect, useMemo} from "react";
import {useParams, Link} from "react-router-dom";
import {useAuth} from "@/src/context/AuthContext";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrder} from "@/src/store/ordersSlice";
import DataTable from "react-data-table-component";
import Loader from "@/src/components/common/Loader.jsx";
import {useTranslation} from "react-i18next";

const OrderDetails = () => {
    const dispatch = useDispatch();
    const {orderId} = useParams();
    const {user} = useAuth();
    const {t} = useTranslation();

    const {order: currentOrder, loading, error} = useSelector((state) => state.orders);
    const currentLang = useSelector((state) => state.language.current);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrder({id: orderId}));
        }
    }, [dispatch, orderId]);

    const isOrderOwner = useMemo(() => user?.id === currentOrder?.user_id, [user, currentOrder]);
    const isManager = useMemo(() => user?.role === "manager", [user]);

    if (loading) return (<Loader/>);
    if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
    if (!currentOrder) return <p className="text-gray-500 text-center">Order not found.</p>;

    const orderItemColumns = [
        {name: t('orderDetails.columns.product'), selector: row => row.product?.name || t('global.na'), sortable: true},
        {
            name: t('orderDetails.columns.quantity'),
            selector: row => `${row.quantity} ${row.uom?.symbol || ''}`,
            sortable: true
        },
        {name: t('orderDetails.columns.totalPrice'), selector: row => `${row.total_price} EGP`, sortable: true},
        {
            name: t('orderDetails.columns.dimensions'),
            cell: row =>
                row.dimension_values?.length ? (
                    <ul className="text-sm text-gray-700 list-disc pl-4">
                        {row.dimension_values.map(d => (
                            <li key={d.id}>
                                {d.dimension?.name || `Dim ${d.dimension_id}`}: {d.value} {d.dimension?.uom?.symbol || ""}
                            </li>
                        ))}
                    </ul>
                ) : "—"
        }
    ];

    const bundleColumns = [
        {name: t('orderDetails.columns.bundle'), selector: b => b.bundle?.name || t('global.na'), sortable: true},
        {name: t('orderDetails.columns.totalUnits'), selector: b => b.total_units, sortable: true},
        {
            name: t('orderDetails.columns.config'),
            cell: b => (
                <ul className="text-sm list-disc pl-4">
                    <li>{t('orderDetails.columns.height')}: {b.height}</li>
                    <li>{t('orderDetails.columns.beltWidth')}: {b.belt_width}</li>
                    <li>{t('orderDetails.columns.lines')}: {b.lines_number}</li>
                    <li>{t('orderDetails.columns.unitsPerLine')}: {b.units_per_line}</li>
                    <li>{t('orderDetails.columns.levels')}: {b.levels}</li>
                </ul>
            )
        },
        {
            name: t('orderDetails.columns.progress'),
            selector: b => `${b.progress}% (${b.status})`,
            sortable: true
        }
    ];

    const paymentColumns = [
        {name: t('orderDetails.columns.method'), selector: p => p.payment_method, sortable: true},
        {name: t('orderDetails.columns.amount'), selector: p => `${p.amount} EGP`, sortable: true},
        {name: t('orderDetails.columns.status'), selector: p => p.status, sortable: true},
        {name: t('orderDetails.columns.reference'), selector: p => p.transaction_reference || "—", sortable: true},
    ];

    const shipmentColumns = [
        {name: t('orderDetails.columns.carrier'), selector: s => s.carrier || "—", sortable: true},
        {name: t('orderDetails.columns.tracking'), selector: s => s.tracking_number || "—", sortable: true},
        {name: t('orderDetails.columns.status'), selector: s => s.status, sortable: true},
        {name: t('orderDetails.columns.shippedAt'), selector: s => s.shipped_at, sortable: true},
        {name: t('orderDetails.columns.notes'), selector: s => s.notes || "—", sortable: true},
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('orderDetailsPage.title')}</h2>
            <div className="mt-6">
                <Link to="/orders" className="text-blue-500 hover:underline">&larr; {t('orderDetailsPage.back')}</Link>
            </div>

            {/* Order Info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <p><strong>{t('orderDetailsPage.meta.orderNumber')}:</strong> {currentOrder.order_number}</p>
                <p><strong>{t('orderDetailsPage.meta.status')}:</strong> {currentOrder.status}</p>
                <p><strong>{t('orderDetailsPage.meta.orderedAt')}:</strong> {currentOrder.ordered_at}</p>
                <p>
                    <strong>{t('orderDetailsPage.meta.notes')}:</strong> {currentOrder.notes || t('orderDetailsPage.meta.noNotes')}
                </p>
                <p>
                    <strong>{t('orderDetailsPage.meta.createdBy')}:</strong> {currentOrder.user?.name} ({currentOrder.user?.email})
                </p>
                {isOrderOwner &&
                    <p className="text-sm text-green-600 italic mt-1">{t('orderDetailsPage.meta.ownerNote')}</p>}
            </div>

            {/* Customer Info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">{t('orderDetailsPage.customer.title')}</h3>
                <p><strong>{t('orderDetailsPage.customer.name')}:</strong> {currentOrder.customer?.name}</p>
                <p><strong>{t('orderDetailsPage.customer.email')}:</strong> {currentOrder.customer?.email}</p>
                <p><strong>{t('orderDetailsPage.customer.phone')}:</strong> {currentOrder.customer?.phone}</p>
                <p><strong>{t('orderDetailsPage.customer.address')}:</strong> {currentOrder.customer?.address}</p>
            </div>

            {/* Order Items Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <DataTable
                    key={currentLang}
                    title={t('orderDetailsPage.tables.items')}
                    columns={orderItemColumns}
                    data={currentOrder.order_items || []}
                    pagination
                    highlightOnHover
                    striped
                />
            </div>

            {/* Bundles Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <DataTable
                    key={currentLang}
                    title={t('orderDetailsPage.tables.bundles')}
                    columns={bundleColumns}
                    data={currentOrder.bundles || []}
                    pagination
                    highlightOnHover
                    striped
                />
            </div>

            {/* Payments Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <DataTable
                    key={currentLang}
                    title={t('orderDetailsPage.tables.payments')}
                    columns={paymentColumns}
                    data={currentOrder.payments || []}
                    pagination
                    highlightOnHover
                    striped
                    noDataComponent={<p className="text-gray-500">{t('orderDetailsPage.tables.noPayments')}</p>}
                />
            </div>

            {/* Shipments Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <DataTable
                    key={currentLang}
                    title={t('orderDetailsPage.tables.shipments')}
                    columns={shipmentColumns}
                    data={currentOrder.shipments || []}
                    pagination
                    highlightOnHover
                    striped
                    noDataComponent={<p className="text-gray-500">{t('orderDetailsPage.tables.noShipments')}</p>}
                />
            </div>

            {/* Actions */}
            {(isOrderOwner || isManager) && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-2">{t('orderDetailsPage.actions.title')}</h3>
                    <div className="flex gap-2">
                        {isManager && currentOrder.status === "pending" && (
                            <>
                                <button
                                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">{t('orderDetailsPage.actions.approve')}
                                </button>
                                <button
                                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">{t('orderDetailsPage.actions.reject')}
                                </button>
                            </>
                        )}
                        {isOrderOwner && (
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">{t('orderDetailsPage.actions.edit')}
                                Order</button>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <Link to="/orders" className="text-blue-500 hover:underline">&larr; {t('orderDetailsPage.back')}</Link>
            </div>
        </div>
    );
};

export default OrderDetails;
