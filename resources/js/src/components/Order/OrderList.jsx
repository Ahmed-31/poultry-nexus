// resources/js/src/components/Orders/OrderList.jsx
import React, {useState, useMemo} from 'react';
import {Link} from "react-router-dom";
import {Button} from '@/Components/ui/button';
import {useOrders} from '@/src/context/OrderContext';
import OrderForm from './OrderForm.jsx';
import DataTable from 'react-data-table-component';
import ExpandedOrderDetails from './ExpandedOrderDetails.jsx';


const OrderList = () => {
    const {orders, loading, error, deleteOrderItem} = useOrders();
    const [showForm, setShowForm] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    const columns = useMemo(() => [
        {name: 'Order Number', selector: row => row.order_number, sortable: true},
        {name: 'Customer', selector: row => row.customer?.name || 'N/A', sortable: true},
        {name: 'Status', selector: row => row.status, sortable: true},
        {
            name: 'Actions',
            cell: row => (
                <div className="flex justify-center space-x-2">
                    <Link
                        to={`/orders/${row.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md transition duration-200"
                    >
                        View Details
                    </Link>
                    <Button variant="warning" onClick={() => handleEdit(row)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(row.id)}>Delete</Button>
                </div>
            ),
        },
    ], []);

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Orders List</h2>
                <Button onClick={() => setShowForm(true)} variant="primary">Create New Order</Button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded shadow-sm"
                />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className={`transition-all duration-300 ${showForm ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
                <div className={`${showForm ? 'md:col-span-1' : ''}`}>
                    <DataTable
                        columns={columns}
                        data={filteredOrders}
                        progressPending={loading}
                        noDataComponent={<p className="text-center text-gray-500">No orders available</p>}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        persistTableHead
                        expandableRows
                        expandableRowsComponent={ExpandedOrderDetails}
                        className="border rounded shadow-sm"
                    />
                </div>

                {showForm && (
                    <div className="md:col-span-1 bg-gray-50 p-4 border rounded shadow-sm">
                        <OrderForm onClose={handleCloseForm} initialData={editOrder}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
