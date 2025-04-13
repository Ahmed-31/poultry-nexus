import {useEffect, useMemo} from "react";
import {useParams, Link} from "react-router-dom";
import {useAuth} from "@/src/context/AuthContext";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrder} from "@/src/store/ordersSlice";
import DataTable from "react-data-table-component";

const OrderDetails = () => {
    const dispatch = useDispatch();
    const {orderId} = useParams();
    const {user} = useAuth();

    const {order: currentOrder, loading, error} = useSelector((state) => state.orders);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrder({id: orderId}));
        }
    }, [dispatch, orderId]);

    const isOrderOwner = useMemo(() => user?.id === currentOrder?.user_id, [user, currentOrder]);
    const isManager = useMemo(() => user?.role === "manager", [user]);

    if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
    if (!currentOrder) return <p className="text-gray-500 text-center">Order not found.</p>;

    const orderItemColumns = [
        {name: "Product", selector: row => row.product?.name || "N/A", sortable: true},
        {name: "Quantity", selector: row => `${row.quantity} ${row.uom?.symbol || ''}`, sortable: true},
        {name: "Total Price", selector: row => `${row.total_price} EGP`, sortable: true},
        {
            name: "Dimensions",
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
        {name: "Bundle", selector: b => b.bundle?.name || "N/A", sortable: true},
        {name: "Total Units", selector: b => b.total_units, sortable: true},
        {
            name: "Config",
            cell: b => (
                <ul className="text-sm list-disc pl-4">
                    <li>Height: {b.height}</li>
                    <li>Belt Width: {b.belt_width}</li>
                    <li>Lines: {b.lines_number}</li>
                    <li>Units/Line: {b.units_per_line}</li>
                    <li>Levels: {b.levels}</li>
                </ul>
            )
        },
        {
            name: "Progress",
            selector: b => `${b.progress}% (${b.status})`,
            sortable: true
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
            <div className="mt-6">
                <Link to="/orders" className="text-blue-500 hover:underline">&larr; Back to Orders</Link>
            </div>

            {/* Order Info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <p><strong>Order Number:</strong> {currentOrder.order_number}</p>
                <p><strong>Status:</strong> {currentOrder.status}</p>
                <p><strong>Ordered At:</strong> {currentOrder.ordered_at}</p>
                <p><strong>Notes:</strong> {currentOrder.notes || "No notes provided"}</p>
                <p><strong>Created By:</strong> {currentOrder.user?.name} ({currentOrder.user?.email})</p>
                {isOrderOwner && <p className="text-sm text-green-600 italic mt-1">You created this order.</p>}
            </div>

            {/* Customer Info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {currentOrder.customer?.name}</p>
                <p><strong>Email:</strong> {currentOrder.customer?.email}</p>
                <p><strong>Phone:</strong> {currentOrder.customer?.phone}</p>
                <p><strong>Address:</strong> {currentOrder.customer?.address}</p>
            </div>

            {/* Order Items Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <DataTable
                    title="Order Items"
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
                    title="Order Bundles"
                    columns={bundleColumns}
                    data={currentOrder.bundles || []}
                    pagination
                    highlightOnHover
                    striped
                />
            </div>

            {/* Payments Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">Payments</h3>
                {Array.isArray(currentOrder.payments) && currentOrder.payments.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-4 text-left">Method</th>
                                <th className="py-2 px-4 text-left">Amount</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrder.payments.map(payment => (
                                <tr key={payment.id} className="border-b">
                                    <td className="py-2 px-4">{payment.payment_method}</td>
                                    <td className="py-2 px-4">{payment.amount} EGP</td>
                                    <td className="py-2 px-4">{payment.status}</td>
                                    <td className="py-2 px-4">{payment.transaction_reference}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No payment records available.</p>
                )}
            </div>

            {/* Shipments Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">Shipment Info</h3>
                {Array.isArray(currentOrder.shipments) && currentOrder.shipments.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-4 text-left">Carrier</th>
                                <th className="py-2 px-4 text-left">Tracking</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Shipped At</th>
                                <th className="py-2 px-4 text-left">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrder.shipments.map(shipment => (
                                <tr key={shipment.id} className="border-b">
                                    <td className="py-2 px-4">{shipment.carrier}</td>
                                    <td className="py-2 px-4">{shipment.tracking_number}</td>
                                    <td className="py-2 px-4">{shipment.status}</td>
                                    <td className="py-2 px-4">{shipment.shipped_at}</td>
                                    <td className="py-2 px-4">{shipment.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No shipment records available.</p>
                )}
            </div>

            {/* Actions */}
            {(isOrderOwner || isManager) && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-2">Order Actions</h3>
                    <div className="flex gap-2">
                        {isManager && currentOrder.status === "pending" && (
                            <>
                                <button
                                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Approve
                                </button>
                                <button
                                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Reject
                                </button>
                            </>
                        )}
                        {isOrderOwner && (
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Edit
                                Order</button>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <Link to="/orders" className="text-blue-500 hover:underline">&larr; Back to Orders</Link>
            </div>
        </div>
    );
};

export default OrderDetails;
