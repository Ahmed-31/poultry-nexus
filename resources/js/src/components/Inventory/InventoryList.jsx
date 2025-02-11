// resources/js/src/components/Inventory/InventoryList.jsx
import React, {useState, useMemo} from 'react';
import InventoryForm from './InventoryForm.jsx';
import Button from '../Common/Button.jsx';
import {useInventory} from '../../context/InventoryContext';
import DataTable from 'react-data-table-component';

const InventoryList = () => {
    const {inventory, loading, error, deleteInventoryItem} = useInventory();
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredProducts = useMemo(() => {
        return inventory.filter(item =>
            item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.quantity.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [inventory, searchTerm]);

    const columns = useMemo(() => [
        {name: 'Id', selector: row => row.id, sortable: true},
        {name: 'Product', selector: row => row.product.name, sortable: true},
        {name: 'Quantity', selector: row => row.quantity, sortable: true},
        {name: 'Warehouse', selector: row => row.warehouse.name, sortable: true},
        {
            name: 'Actions',
            cell: row => (
                <div className="flex justify-center space-x-2">
                    <Button
                        variant="warning"
                        onClick={() => handleEdit(row)}
                        className="px-4 py-2 text-sm rounded-md hover:shadow transition"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleDelete(row.id)}
                        className="px-4 py-2 text-sm rounded-md hover:shadow transition"
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ], []);

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Inventory List</h2>
                <Button onClick={() => setShowForm(true)} variant="primary"
                        className="px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition">
                    Add Inventory
                </Button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search inventory..."
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
                        data={filteredProducts}
                        progressPending={loading}
                        noDataComponent={<p className="text-center text-gray-500">No products available</p>}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        persistTableHead
                        className="border rounded shadow-sm"
                    />
                </div>
            </div>

            {showForm && (
                <div className="md:col-span-1 bg-gray-50 p-4 border rounded shadow-sm">
                    <InventoryForm onClose={handleCloseForm} initialData={editItem}/>
                </div>
            )}
        </div>

    );
};

export default InventoryList;
