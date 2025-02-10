// resources/js/src/components/Orders/OrderList.jsx
import React, {useState} from 'react';
import Button from '../Common/Button.jsx';
import {useOrders} from '../../context/OrderContext';
import Loader from '../Common/Loader.jsx';
import OrderForm from './OrderForm.jsx';

const OrderList = () => {
    const {orders, loading, error, deleteOrderItem} = useOrders();
    const [showForm, setShowForm] = useState(false);
    const [editOrder, setEditOrder] = useState(null);

    const handleEdit = (order) => {
        setEditOrder(order);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteOrderItem(id);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditOrder(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Orders List</h2>
                <Button onClick={() => setShowForm(true)} variant="primary">Create New Order</Button>
            </div>

            {showForm && (
                <OrderForm onClose={handleCloseForm} initialData={editOrder}/>
            )}

            {loading ? (
                <Loader/>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <table className="w-full bg-white shadow rounded-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-4">Order Number</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="text-center border-b">
                                <td className="p-4">{order.order_number}</td>
                                <td className="p-4">{order.customer.name}</td>
                                <td className="p-4">{order.status}</td>
                                <td className="p-4 flex justify-center space-x-2">
                                    <Button variant="warning" onClick={() => handleEdit(order)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(order.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderList;
