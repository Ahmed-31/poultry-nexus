import React, {useEffect, useState, useMemo} from "react";
import DataTable from "react-data-table-component";
import {Button} from "@/Components/ui/button";
import {FaPlus} from "react-icons/fa";
import ExpandedBundleProducts from "@/src/components/Stock/ExpandedBundleProducts";
import {useDispatch, useSelector} from "react-redux";
import {fetchProductBundlesTable, removeProductBundle} from "@/src/store/productBundlesSlice.jsx";
import ProductBundleFormModal from "@/src/components/Stock/ProductBundleFormModal.jsx";

const ProductBundlesTable = () => {
    const dispatch = useDispatch();

    const bundles = useSelector((state) => state.productBundles.dataTable || []);
    const loading = useSelector((state) => state.productBundles.loading);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editBundle, setEditBundle] = useState(null);

    useEffect(() => {
        dispatch(fetchProductBundlesTable());
    }, []);

    const filteredBundles = useMemo(() => {
        return bundles.filter((bundle) =>
            bundle.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bundles, searchTerm]);

    const handleEdit = (bundle) => {
        setEditBundle(bundle);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this bundle?")) {
            dispatch(removeProductBundle({id: id}))
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditBundle(null);
        dispatch(fetchProductBundlesTable());
    };

    const columns = [
        {name: "Bundle Name", selector: row => row.name, sortable: true},
        {name: "Description", selector: row => row.description, sortable: true},
        {
            name: "Created At",
            selector: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button variant="warning" onClick={() => handleEdit(row)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(row.id)}>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-none overflow-x-hidden">
            <div className="flex justify-end items-center px-8 py-6">
                <Button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 text-white flex items-center font-medium"
                >
                    <FaPlus className="mr-2"/> Add Bundle
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-5 rounded-xl shadow mx-8">
                <input
                    type="text"
                    placeholder="🔍 Search bundle name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
                />
            </div>

            <div className="w-full overflow-x-auto">
                <div className="w-full">
                    <DataTable
                        columns={columns}
                        data={filteredBundles}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        className="border rounded-none shadow-sm w-full"
                        expandableRows
                        expandableRowsComponent={ExpandedBundleProducts}
                    />
                </div>
            </div>

            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                    <div
                        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 transform transition-all">
                        <ProductBundleFormModal showModal={showForm} onClose={handleCloseForm} initialData={editBundle}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductBundlesTable;
