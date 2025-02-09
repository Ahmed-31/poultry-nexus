// resources/js/src/components/Inventory/InventoryForm.jsx
import React, {useState, useEffect} from 'react';
import Button from '../Common/Button.jsx';
import {useInventory} from '../../context/InventoryContext';

const InventoryForm = ({onClose, initialData}) => {
    const {products, warehouses, addInventoryItem, updateInventoryItem} = useInventory();

    // Initialize form state with either initialData (for editing) or empty fields (for adding)
    const [formData, setFormData] = useState({
        product: '',
        total_stock: '',
        warehouse: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                product: initialData.product || '',
                total_stock: initialData.total_stock || '',
                warehouse: initialData.warehouse || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (initialData) {
            await updateInventoryItem(initialData.id, formData);
        } else {
            await addInventoryItem(formData);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
                    {initialData ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
                        <select
                            name="product_id"
                            value={formData.product.id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                        <input
                            type="number"
                            name="total_stock"
                            value={formData.total_stock}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Warehouse</label>
                        <select
                            name="warehouse_id"
                            value={formData.warehouse.id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="">Select Warehouse</option>
                            {warehouses.map(warehouse => (
                                <option key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            {initialData ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryForm;
