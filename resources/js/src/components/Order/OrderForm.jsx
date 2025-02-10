import React, {useState, useEffect} from 'react';
import Button from '../Common/Button.jsx';
import {useOrders} from '../../context/OrderContext';

const OrderForm = ({onClose, initialData}) => {
    const {addOrderItem, updateOrderItem, products, customers, productBundles} = useOrders();

    const [formData, setFormData] = useState({
        customer_id: '',
        order_items: [],
        order_bundles: [],
        notes: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                customer_id: initialData.customer_id || '',
                order_items: initialData.order_items || [],
                order_bundles: initialData.bundles || [],
                notes: initialData.notes || '',
            });
        }
    }, [initialData]);

    const handleItemChange = (e, index) => {
        const updatedItems = [...formData.order_items];
        updatedItems[index][e.target.name] = e.target.value;
        setFormData(prev => ({...prev, order_items: updatedItems}));
    };

    const handleBundleChange = (e, index) => {
        const updatedBundles = [...formData.order_bundles];
        updatedBundles[index][e.target.name] = e.target.value;
        setFormData(prev => ({...prev, order_bundles: updatedBundles}));
    };

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const addProductLine = () => {
        setFormData(prev => ({
            ...prev,
            order_items: [...prev.order_items, {product_id: '', quantity: 1}]
        }));
    };

    const addBundleLine = () => {
        setFormData(prev => ({
            ...prev,
            order_bundles: [...prev.order_bundles, {product_bundle_id: '', quantity: 1}]
        }));
    };

    const removeProductLine = (index) => {
        const updatedItems = formData.order_items.filter((_, i) => i !== index);
        setFormData(prev => ({...prev, order_items: updatedItems}));
    };

    const removeBundleLine = (index) => {
        const updatedBundles = formData.order_bundles.filter((_, i) => i !== index);
        setFormData(prev => ({...prev, order_bundles: updatedBundles}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (initialData) {
            await updateOrderItem(initialData.id, formData);
        } else {
            await addOrderItem(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    {initialData ? 'Edit Order' : 'Create New Order'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Customer</label>
                        <select
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="" disabled>Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Order Items</h3>
                        {formData.order_items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 mt-2">
                                <select
                                    name="product_id"
                                    value={item.product_id}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-2/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="" disabled>Select Product</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-1/4 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    required
                                />

                                <Button type="button" variant="danger" onClick={() => removeProductLine(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={addProductLine} className="mt-2">
                            Add Product
                        </Button>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Order Bundles</h3>
                        {formData.order_bundles.map((bundle, index) => (
                            <div key={index} className="flex items-center space-x-2 mt-2">
                                <select
                                    name="product_bundle_id"
                                    value={bundle.product_bundle_id}
                                    onChange={(e) => handleBundleChange(e, index)}
                                    className="w-2/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="" disabled>Select Product Bundle</option>
                                    {productBundles.map(productBundle => (
                                        <option key={productBundle.id}
                                                value={productBundle.id}>{productBundle.name}</option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={bundle.quantity}
                                    onChange={(e) => handleBundleChange(e, index)}
                                    className="w-1/4 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    required
                                />

                                <Button type="button" variant="danger" onClick={() => removeBundleLine(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={addBundleLine} className="mt-2">
                            Add Bundle
                        </Button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" onClick={onClose} variant="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {initialData ? 'Update Order' : 'Create Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
