// resources/js/src/components/Inventory/InventoryList.jsx
import React, {useState} from 'react';
import InventoryForm from './InventoryForm.jsx';
import Button from '../Common/Button.jsx';
import Loader from '../Common/Loader.jsx';
import {useInventory} from '../../context/InventoryContext';

const InventoryList = () => {
    const {inventory, loading, error, deleteInventoryItem} = useInventory();
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteInventoryItem(id);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditItem(null);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Inventory List</h2>
                <Button onClick={() => setShowForm(true)} variant="primary"
                        className="px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition">
                    Add Inventory
                </Button>
            </div>

            {showForm && (
                <InventoryForm onClose={handleCloseForm} initialData={editItem}/>
            )}

            {loading ? (
                <Loader/>
            ) : error ? (
                <p className="text-red-500 text-center font-medium">{error}</p>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="w-full bg-white rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-left uppercase text-sm">
                                <th className="p-4">ID</th>
                                <th className="p-4">Product</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Warehouse</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={`border-b hover:bg-gray-50 transition ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    <td className="p-4">{item.id}</td>
                                    <td className="p-4">{item.product.name}</td>
                                    <td className="p-4">{item.total_stock}</td>
                                    <td className="p-4">{item.warehouse.name}</td>
                                    <td className="p-4 flex justify-center space-x-3">
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEdit(item)}
                                            className="px-4 py-2 text-sm rounded-md hover:shadow transition"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(item.id)}
                                            className="px-4 py-2 text-sm rounded-md hover:shadow transition"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

    );
};

export default InventoryList;
