import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {addProduct, editProduct} from '../../store/productsSlice.jsx';
import Button from '../Common/Button.jsx';

const ProductForm = ({onClose, initialData}) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        min_stock: 0,
        sku: '',
        unit: '',
        category_id: '',
        type: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                min_stock: initialData.min_stock || 0,
                sku: initialData.sku || '',
                unit: initialData.unit || '',
                category_id: initialData.category_id || '',
                type: initialData.type || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.price || isNaN(formData.price) || formData.price <= 0) newErrors.price = "Valid price is required";
        if (!formData.sku) newErrors.sku = "SKU is required";
        if (!formData.unit) newErrors.unit = "Unit is required";
        if (!formData.category_id) newErrors.category_id = "Category is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (initialData) {
            dispatch(editProduct({id: initialData.id, ...formData}));
        } else {
            dispatch(addProduct(formData));
        }

        onClose();
    };

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">{initialData ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    />
                    {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium">Minimum Stock</label>
                    <input
                        type="number"
                        name="min_stock"
                        value={formData.min_stock}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium">SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    />
                    {errors.sku && <p className="text-red-500 text-xs">{errors.sku}</p>}
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium">Unit</label>
                    <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    />
                    {errors.unit && <p className="text-red-500 text-xs">{errors.unit}</p>}
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium">Category ID</label>
                    <input
                        type="text"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    />
                    {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    >
                        <option value="">Select Type</option>
                        <option value="raw_material">Raw Material</option>
                        <option value="pre_made_component">Pre-Made Component</option>
                        <option value="finished_product">Finished Product</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        {initialData ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
