import React from "react";
import ProductsTable from "@/src/components/Stock/ProductsTable";
import ProductBundlesTable from "@/src/components/Stock/ProductBundlesTable";

const ProductsPage = () => {
    return (
        <div className="p-6 space-y-12">
            <section>
                <h1 className="text-3xl font-bold mb-4 text-gray-800">📦 Products</h1>
                <ProductsTable/>
            </section>

            <section>
                <h1 className="text-3xl font-bold mb-4 text-gray-800">🎁 Product Bundles</h1>
                <ProductBundlesTable/>
            </section>
        </div>
    );
};

export default ProductsPage;
