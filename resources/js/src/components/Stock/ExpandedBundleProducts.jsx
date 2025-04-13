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

const ExpandedBundleProducts = ({data}) => {
    const productColumns = [
        {name: "SKU", selector: row => row.sku, sortable: true},
        {name: "Name", selector: row => row.name, sortable: true},
        {name: "Type", selector: row => row.type, sortable: true},
        {
            name: "Quantity",
            selector: row => row.quantity
        },
        {
            name: "Unit",
            selector: row => row.uom_id,
            sortable: true,
            cell: row => <span>{row.uom_name || "-"}</span>,
        },
        {
            name: "Dimensions",
            cell: row => {
                const dims = row.dimension_values;
                return dims && Object.keys(dims).length > 0
                    ? (
                        <div className="text-xs text-gray-700 space-y-1">
                            {Object.entries(dims).map(([key, val]) => (
                                <div key={key}><strong>{key}</strong>: {val}</div>
                            ))}
                        </div>
                    )
                    : <span className="text-gray-400 italic">None</span>;
            }
        },
        {
            name: "Price",
            selector: row => parseFloat(row.price).toFixed(2),
            sortable: true,
        }
    ];


    return (
        <div className="p-4 bg-gray-50 border rounded space-y-4">
            <h3 className="text-xl font-bold mb-4">🎁 Bundle Details: {data.name}</h3>

            <Section title="Bundle Description">
                <div className="text-sm text-gray-700">
                    {data.description || "No description provided."}
                </div>
            </Section>

            <Section title="Included Products">
                <DataTable
                    keyField="unique_key"
                    columns={productColumns}
                    data={data.products || []}
                    noHeader
                    dense
                    striped
                    highlightOnHover
                />
            </Section>
        </div>
    );
};

export default ExpandedBundleProducts;
