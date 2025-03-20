import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {addWarehouseItem, updateWarehouseItem} from '../../store/warehouseSlice.jsx';
import Button from '../Common/Button.jsx';

const WarehouseForm = ({onClose, initialData}) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                location: initialData.location || '',
                description: initialData.description || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.location) newErrors.location = "Location is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (initialData) {
            dispatch(updateWarehouseItem({id: initialData.id, ...formData}));
        } else {
            dispatch(addWarehouseItem(formData));
        }

        onClose();
    };

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">{initialData ? "Edit Warehouse" : "Add Warehouse"}</h2>
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
                    <label className="block text-sm font-medium">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="border p-2 w-full rounded-md"
                    />
                    {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
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

export default WarehouseForm;
