import React, {useState, useEffect} from 'react';
import {Button} from '@/Components/ui/button';
import {useOrders} from '@/src/context/OrderContext';

const OrderForm = ({onClose, initialData}) => {
    const {addOrderItem, updateOrderItem, products, customers, productBundles} = useOrders();

    const [formData, setFormData] = useState({
        customer_id: '',
        order_number: '',
        order_items: [],
        order_bundles: [],
        notes: '',
        ordered_at: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                customer_id: initialData.customer_id || '',
                order_number: initialData.order_number || '',
                order_items: initialData.order_items || [],
                order_bundles: initialData.bundles || [],
                notes: initialData.notes || '',
                ordered_at: initialData.ordered_at
                    ? new Date(initialData.ordered_at).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
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
            order_bundles: [...prev.order_bundles, {
                product_bundle_id: '',
                height: 1,
                belt_width: 1,
                lines_number: 1,
                units_per_line: 1,
                poultry_house_count: 1,
                levels: 1
            }]
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b bg-white sticky top-0 z-10">
                    <h2 className="text-3xl font-bold text-center text-gray-900">
                        {initialData ? 'Edit Order' : 'Create New Order'}
                    </h2>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 flex-1">
                    <form id="orders-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Customer</label>
                            <select
                                name="customer_id"
                                value={formData.customer_id}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Order Date</label>
                                <input
                                    type="date"
                                    name="ordered_at"
                                    value={formData.ordered_at}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Order Number</label>
                                <input
                                    type="text"
                                    name="order_number"
                                    value={formData.order_number}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                            {formData.order_items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 mt-2">
                                    <select
                                        name="product_id"
                                        value={item.product_id}
                                        onChange={(e) => handleItemChange(e, index)}
                                        className="w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="" disabled>Select Product</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        name="quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(e, index)}
                                        className="w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                        required
                                    />

                                    <Button type="button" variant="destructive" onClick={() => removeProductLine(index)}>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="secondary" onClick={addProductLine} className="mt-4">
                                Add Product
                            </Button>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Bundles</h3>
                            {formData.order_bundles.map((bundle, index) => (
                                <div key={index}
                                     className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow mb-4">

                                    <div className="sm:col-span-2">
                                        <label className="block text-gray-700 font-semibold mb-1">Product Bundle</label>
                                        <select
                                            name="product_bundle_id"
                                            value={bundle.product_bundle_id}
                                            onChange={(e) => handleBundleChange(e, index)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="" disabled>Select Product Bundle</option>
                                            {productBundles.map((productBundle) => (
                                                <option key={productBundle.id}
                                                        value={productBundle.id}>{productBundle.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Height</label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={bundle.height}
                                            min="1"
                                            onChange={(e) => handleBundleChange(e, index)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Belt Width</label>
                                        <input
                                            type="number"
                                            name="belt_width"
                                            value={bundle.belt_width}
                                            min="1"
                                            onChange={(e) => handleBundleChange(e, index)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Levels</label>
                                        <input
                                            type="number"
                                            name="levels"
                                            value={bundle.levels}
                                            min="1"
                                            onChange={(e) => handleBundleChange(e, index)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Units Per Line</label>
                                        <input
                                            type="number"
                                            name="units_per_line"
                                            value={bundle.units_per_line}
                                            min="1"
                                            onChange={(e) => handleBundleChange(e, index)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Lines Number</label>
                                        <input
                                            type="number"
                                            name="lines_number"
                                            value={bundle.lines_number}
                                            min="1"
                                            onChange={(e) => handleBundleChange(e, index)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Poultry House
                                            Count</label>
                                        <input
                                            type="number"
                                            name="poultry_house_count"
                                            value={bundle.poultry_house_count}
                                            min="1"
                                            onChange={(e) => handleBundleChange(e, index)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2 flex justify-end">
                                        <Button type="button" variant="destructive" onClick={() => removeBundleLine(index)}>
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="secondary" onClick={addBundleLine} className="mt-4">
                                Add Bundle
                            </Button>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            ></textarea>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t bg-white sticky bottom-0 z-10 flex justify-end space-x-4">
                    <Button type="button" onClick={onClose} variant="secondary" className="px-4 py-2 rounded-lg">
                        Cancel
                    </Button>
                    <Button type="submit" form="orders-form" variant="primary" className="px-4 py-2 rounded-lg">
                        {initialData ? 'Update Order' : 'Create Order'}
                    </Button>
                </div>
            </div>
        </div>

    );
};

export default OrderForm;
