import React, {useEffect, useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchProductsTable, removeProduct} from "../store/productsSlice";
import DataTable from "react-data-table-component";
import Button from "../components/common/Button";
import {FaPlus} from "react-icons/fa";
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
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            {/* Header Section */}
            <div className="flex justify-between items-center px-8 py-6">
                <h2 className="text-4xl font-bold text-gray-800">📦 Product Management</h2>
                <Button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                >
                    <FaPlus className="mr-2"/> Add Product
                </Button>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder="🔍 Search product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                >
                    <option value="">All Categories</option>
                    <option value="1">Electronics</option>
                    <option value="2">Raw Materials</option>
                </select>

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                >
                    <option value="">All Types</option>
                    <option value="raw_material">Raw Material</option>
                    <option value="component">Component</option>
                    <option value="consumable">Consumable</option>
                </select>
            </div>

            {/* Full-Width DataTable */}
            <div className="w-full overflow-x-auto">
                <div className="w-full">
                    <DataTable
                        columns={columns}
                        data={filteredProducts}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        className="border rounded-none shadow-sm w-full"
                    />
                </div>
            </div>

            {/* Modal for Product Form */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                    <div
                        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 transform transition-all">
                        <ProductForm onClose={handleCloseForm} initialData={editOrder}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
