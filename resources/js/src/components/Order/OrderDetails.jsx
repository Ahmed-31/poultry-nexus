import {useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {useOrders} from "@/src/context/OrderContext";
import {useAuth} from "@/src/context/AuthContext";

const OrderDetails = () => {
    const {orderId} = useParams();
    const {user} = useAuth();
    const {currentOrder, loading, error, fetchOrderById} = useOrders();

    useEffect(() => {
        if (orderId) {
            fetchOrderById(orderId);
        }
    }, [orderId]);

    if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
    if (!currentOrder) return <p className="text-gray-500 text-center">Order not found.</p>;

    const isOrderOwner = user.id === currentOrder.user_id;
    const isManager = user.role === "manager";

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <p className="text-gray-700"><strong>Order Number:</strong> {currentOrder.order_number}</p>
                <p className="text-gray-700"><strong>Status:</strong> {currentOrder.status}</p>
                <p className="text-gray-700"><strong>Ordered At:</strong> {currentOrder.ordered_at}</p>
                <p className="text-gray-700"><strong>Notes:</strong> {currentOrder.notes || "No notes provided"}</p>

                <p className="text-gray-700">
                    <strong>Created By:</strong> {currentOrder.user.name} ({currentOrder.user.email})
                </p>

                {isOrderOwner && (
                    <p className="text-green-600 font-semibold mt-2">You created this order.</p>
                )}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Information</h3>
                <p className="text-gray-700"><strong>Name:</strong> {currentOrder.customer.name}</p>
                <p className="text-gray-700"><strong>Email:</strong> {currentOrder.customer.email}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {currentOrder.customer.phone}</p>
                <p className="text-gray-700"><strong>Address:</strong> {currentOrder.customer.address}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Items</h3>
                {currentOrder.order_items.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-4 text-left">Product</th>
                                <th className="py-2 px-4 text-left">Quantity</th>
                                <th className="py-2 px-4 text-left">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrder.order_items.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-2 px-4">{item.product.name}</td>
                                    <td className="py-2 px-4">{item.quantity}</td>
                                    <td className="py-2 px-4">{item.total_price} EGP</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No items in this order.</p>
                )}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Payments</h3>
                {currentOrder.payments.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-4 text-left">Method</th>
                                <th className="py-2 px-4 text-left">Amount</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Transaction Ref</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrder.payments.map((payment) => (
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

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Shipment Details</h3>
                {currentOrder.shipments.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-4 text-left">Carrier</th>
                                <th className="py-2 px-4 text-left">Tracking Number</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Shipped At</th>
                                <th className="py-2 px-4 text-left">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrder.shipments.map((shipment) => (
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

            {(isOrderOwner || isManager) && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Actions</h3>
                    <div className="flex gap-2">
                        {isManager && currentOrder.status === "pending" && (
                            <>
                                <button
                                    className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-200">
                                    Approve Order
                                </button>
                                <button
                                    className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200">
                                    Reject Order
                                </button>
                            </>
                        )}
                        {isOrderOwner && (
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200">
                                Edit Order
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <Link to="/orders" className="text-blue-500 hover:underline">
                    &larr; Back to Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderDetails;
