import React from "react";
import ProductsTable from "@/src/components/Stock/Product/ProductsTable.jsx";
import ProductBundlesTable from "@/src/components/Stock/Product/ProductBundlesTable.jsx";
import CategoriesTable from "@/src/components/Stock/Category/CategoriesTable.jsx";
import {useTranslation} from "react-i18next";

const ProductsPage = () => {
    const {t} = useTranslation();
    return (
        <div className="p-6 space-y-12">
            <section>
                <h1 className="text-3xl font-bold mb-4 text-gray-800">📦 {t('productsPage.productsTitle')}</h1>
                <ProductsTable/>
            </section>

            <section>
                <h1 className="text-3xl font-bold mb-4 text-gray-800">🎁 {t('productsPage.bundlesTitle')}</h1>
                <ProductBundlesTable/>
            </section>

            <section>
                <h1 className="text-3xl font-bold mb-4 text-gray-800">🎁 {t('productsPage.categoriesTitle')}</h1>
                <CategoriesTable/>
            </section>
        </div>
    );
};

export default ProductsPage;
