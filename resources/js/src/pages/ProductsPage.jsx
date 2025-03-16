import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchProductsTable, removeProduct} from "../store/productsSlice";
import DataTable from "react-data-table-component";
import Button from "../components/common/Button";
import {FaPlus, FaTrash, FaEdit} from "react-icons/fa";
import ProductForm from "@/src/components/Inventory/ProductForm.jsx";

const ProductManagement = () => {
    const dispatch = useDispatch();

    // Fetch products from Redux store
    const products = useSelector((state) => state.products.dataTable || []);
    const loading = useSelector((state) => state.products.loading);

    // State for filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    const [selectedType, setSelectedType] = useState("");

    // Fetch data when the page loads
    useEffect(() => {
        dispatch(fetchProductsTable());
    }, [dispatch]);

    // ✅ Filtered product list
    const filteredProducts = useMemo(() => {
        return products
            .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((product) => (selectedCategory ? product.category.id === selectedCategory : true))
            .filter((product) => (selectedType ? product.type === selectedType : true));
    }, [products, searchTerm, selectedCategory, selectedType]);

    const handleEdit = (order) => {
        setEditOrder(order);
        setShowForm(true);
    };

    // Handle product deletion
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(removeProduct(id));
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditOrder(null);
    };

    // Define table columns
    const columns = [
        {name: "SKU", selector: (row) => row.sku, sortable: true},
        {name: "Product Name", selector: (row) => row.name, sortable: true},
        {name: "Category", selector: (row) => row.category?.name || "N/A", sortable: true},
        {name: "Type", selector: (row) => row.type, sortable: true},
        {name: "Unit", selector: (row) => row.unit, sortable: true},
        {name: "Price", selector: (row) => row.price, sortable: true},
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">📦 Product Management</h2>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                    <FaPlus className="mr-2"/> Add Product
                </Button>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
                <input
                    type="text"
                    placeholder="🔍 Search product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Categories</option>
                    {/* Dynamic categories (replace with actual category data) */}
                    <option value="1">Electronics</option>
                    <option value="2">Raw Materials</option>
                </select>

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Types</option>
                    <option value="raw_material">Raw Material</option>
                    <option value="component">Component</option>
                    <option value="consumable">Consumable</option>
                </select>
            </div>

            {/* Product Table */}
            <div className={`transition-all duration-300 ${showForm ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
                <div className={`${showForm ? 'md:col-span-1' : ''}`}>
                    <DataTable
                        columns={columns}
                        data={filteredProducts}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                    />
                </div>

                {showForm && (
                    <div className="md:col-span-1 bg-gray-50 p-4 border rounded shadow-sm">
                        <ProductForm onClose={handleCloseForm} initialData={editOrder}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
