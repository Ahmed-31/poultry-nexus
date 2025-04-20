import React, {useState} from "react";
import DataTable from "react-data-table-component";

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
    const stockColumns = [
        {name: "Warehouse ID", selector: row => row.warehouse_id, sortable: true},
        {name: "Quantity", selector: row => row.input_quantity, sortable: true},
        {name: "UOM", selector: row => data?.default_uom?.symbol || t('global.na'), sortable: false},
        {name: "Last Updated", selector: row => new Date(row.updated_at).toLocaleString(), sortable: true},
    ];

    const movementColumns = [
        {name: "Date", selector: row => new Date(row.movement_date).toLocaleString(), sortable: true},
        {name: "Type", selector: row => row.movement_type, sortable: true},
        {name: "Quantity", selector: row => row.quantity, sortable: true},
        {name: "Reason", selector: row => row.reason, sortable: false},
    ];

    const dimensions = data?.default_uom?.dimensions || [];

    return (
        <div className="p-4 bg-gray-50 border rounded space-y-4">
            <h3 className="text-xl font-bold mb-4">📦 Product Details: {data.name}</h3>

            <Section title="Product Metadata">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Category:</strong> {data.category?.name || t('global.na')}
                        <br/>
                        <em className="text-gray-500">{data.category?.description}</em>
                    </div>
                    <div>
                        <strong>Type:</strong> {data.type}
                        <br/>
                        <strong>SKU:</strong> {data.sku}
                    </div>
                    <div>
                        <strong>Price:</strong> ${parseFloat(data.price || 0).toFixed(2)}
                        <br/>
                        <strong>Minimum Stock Level:</strong> {data.min_stock}
                    </div>
                    <div>
                        <strong>Dimensions:</strong>{" "}
                        {Array.isArray(data.dimensions) && data.dimensions.length > 0
                            ? data.dimensions.map(dim => dim.name).join(" x ")
                            : t('global.na')}
                    </div>
                </div>
            </Section>

            <Section title="Unit of Measurement (UOM)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Default UOM:</strong> {data.default_uom?.name} ({data.default_uom?.symbol})
                        <br/>
                        <strong>Conversion Factor:</strong> {data.default_uom?.conversion_factor}
                        <br/>
                        <strong>Is Base Unit:</strong> {data.default_uom?.is_base ? "Yes" : "No"}
                    </div>
                    <div>
                        <strong>UOM Group:</strong> {data.default_uom?.group?.name || t('global.na')}
                    </div>
                </div>
                {dimensions.length > 0 && (
                    <div className="mt-4">
                        <strong>Defined Dimensions:</strong>
                        <ul className="list-disc pl-5 mt-1 text-gray-700">
                            {dimensions.map((dim) => (
                                <li key={dim.id}>{dim.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Section>

            {data.allowed_uoms && data.allowed_uoms.length > 0 && (
                <Section title="Allowed UOMs">
                    <ul className="list-disc pl-5 text-sm text-gray-800">
                        {data.allowed_uoms.map((uom) => (
                            <li key={uom.id}>
                                {uom.name} ({uom.symbol}) - Conversion: {uom.conversion_factor}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {data.stock && (
                <Section title="Current Stock Info">
                    <DataTable
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
                <Section title="Stock Movement History">
                    <DataTable
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
