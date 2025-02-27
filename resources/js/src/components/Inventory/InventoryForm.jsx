// resources/js/src/components/Inventory/InventoryForm.jsx
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {addInventoryItem, updateInventoryItem} from '../../store/inventorySlice';
import {fetchProducts} from "@/src/store/productsSlice.jsx";
import {fetchWarehouses} from "@/src/store/warehouseSlice.jsx";

const InventoryForm = ({onClose, initialData}) => {
    const dispatch = useDispatch();

    // Get products and warehouses from Redux store
    const products = useSelector((state) => state.products.list || []);
    const warehouses = useSelector((state) => state.warehouses.items || []);


    // Initialize form state with either initialData (for editing) or empty fields (for adding)
    const [formData, setFormData] = useState({
        product_id: '',
        quantity: '',
        warehouse_id: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                product_id: initialData?.product?.id || '',
                quantity: initialData?.quantity || '',
                warehouse_id: initialData?.warehouse?.id || ''
            });
        }
    }, [initialData]);

    // Fetch products & warehouses when component mounts
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (initialData) {
            dispatch(updateInventoryItem({id: initialData.id, data: formData}));
        } else {
            dispatch(addInventoryItem(formData));
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
                            value={formData.product_id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="" disabled>Select Product</option>
                            {products.length > 0 ? (
                                products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No products available</option>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Warehouse</label>
                        <select
                            name="warehouse_id"
                            value={formData.warehouse_id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="" disabled>Select Warehouse</option>
                            {warehouses.length > 0 ? (
                                warehouses.map(warehouse => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No warehouses available</option>
                            )}
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
