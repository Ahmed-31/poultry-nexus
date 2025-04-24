import React, {useState} from "react";
import DataTable from "react-data-table-component";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const Section = ({title, children}) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-white border rounded-lg p-4 shadow mb-4">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="font-semibold text-lg">{title}</h4>
                <span>{isOpen ? "▼" : "▶"}</span>
            </div>
            {isOpen && <div className="mt-2">{children}</div>}
        </div>
    );
};

const ExpandedProductDetails = ({data}) => {
    const {t} = useTranslation();
    const stockColumns = [
        {name: t('productDetails.tableHeaders.warehouseId'), selector: row => row.warehouse_id, sortable: true},
        {name: t('productDetails.tableHeaders.quantity'), selector: row => row.input_quantity, sortable: true},
        {name: t('productDetails.tableHeaders.uom'), selector: row => data?.default_uom?.symbol || t('global.na'), sortable: false},
        {name: t('productDetails.tableHeaders.lastUpdated'), selector: row => new Date(row.updated_at).toLocaleString(), sortable: true},
    ];

    const movementColumns = [
        {name: t('productDetails.tableHeaders.date'), selector: row => new Date(row.movement_date).toLocaleString(), sortable: true},
        {name: t('productDetails.tableHeaders.type'), selector: row => row.movement_type, sortable: true},
        {name: t('productDetails.tableHeaders.quantity'), selector: row => row.quantity, sortable: true},
        {name: t('productDetails.tableHeaders.reason'), selector: row => row.reason, sortable: false},
    ];

    const dimensions = data?.default_uom?.dimensions || [];
    const currentLang = useSelector((state) => state.language.current);

    return (
        <div className="p-4 bg-gray-50 border rounded space-y-4">
            <h3 className="text-xl font-bold mb-4">📦 {t('productDetails.title')}: {data.name}</h3>

            <Section title={t('productDetails.sections.metadata')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>{t('productDetails.category')}:</strong> {data.category?.name || t('global.na')}
                        <br/>
                        <em className="text-gray-500">{data.category?.description}</em>
                    </div>
                    <div>
                        <strong>{t('productDetails.type')}:</strong> {data.type}
                        <br/>
                        <strong>{t('productDetails.sku')}:</strong> {data.sku}
                    </div>
                    <div>
                        <strong>{t('productDetails.price')}:</strong> ${parseFloat(data.price || 0).toFixed(2)}
                        <br/>
                        <strong>{t('productDetails.minStock')}:</strong> {data.min_stock}
                    </div>
                    <div>
                        <strong>{t('productDetails.dimensions')}:</strong>{" "}
                        {Array.isArray(data.dimensions) && data.dimensions.length > 0
                            ? data.dimensions.map(dim => t(`dimensions.${dim.name}`)).join(" x ")
                            : t('global.na')}
                    </div>
                </div>
            </Section>

            <Section title={t('productDetails.sections.uom')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>{t('productDetails.defaultUom')}:</strong> {data.default_uom?.name} ({data.default_uom?.symbol})
                        <br/>
                        <strong>{t('productDetails.conversionFactor')}:</strong> {data.default_uom?.conversion_factor}
                        <br/>
                        <strong>{t('productDetails.isBase')}:</strong> {data.default_uom?.is_base ? t('global.yes') : t('global.no')}
                    </div>
                    <div>
                        <strong>{t('productDetails.uomGroup')}:</strong> {data.default_uom?.group?.name || t('global.na')}
                    </div>
                </div>
                {dimensions.length > 0 && (
                    <div className="mt-4">
                        <strong>{t('productDetails.definedDimensions')}:</strong>
                        <ul className="list-disc pl-5 mt-1 text-gray-700">
                            {dimensions.map((dim) => (
                                <li key={dim.id}>{t(`dimensions.${dim.name}`)}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Section>

            {data.allowed_uoms && data.allowed_uoms.length > 0 && (
                <Section title={t('productDetails.sections.allowedUoms')}>
                    <ul className="list-disc pl-5 text-sm text-gray-800">
                        {data.allowed_uoms.map((uom) => (
                            <li key={uom.id}>
                                {t(`uoms.${uom.name}`)} ({uom.symbol}) - Conversion: {uom.conversion_factor}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {data.stock && (
                <Section title={t('productDetails.sections.stockInfo')}>
                    <DataTable
                        key={currentLang}
                        columns={stockColumns}
                        data={[data.stock]}
                        noHeader
                        dense
                        striped
                        highlightOnHover
                    />
                </Section>
            )}

            {data.stock_movements?.length > 0 && (
                <Section title={t('productDetails.sections.stockMovements')}>
                    <DataTable
                        key={currentLang}
                        columns={movementColumns}
                        data={data.stock_movements}
                        noHeader
                        dense
                        striped
                        highlightOnHover
                    />
                </Section>
            )}
        </div>
    );
};

export default ExpandedProductDetails;
