import React, {useState, useMemo} from 'react';
import DataTable from 'react-data-table-component';

const Section = ({title, children}) => {
    const [isOpen, setIsOpen] = useState(true); // expanded by default
    return (
        <div className="bg-white border rounded-lg p-4 shadow mb-4">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <h4 className="font-semibold text-lg">{title}</h4>
                <span className="text-gray-500 text-sm">{isOpen ? '▼' : '▶'}</span>
            </div>
            {isOpen && <div className="mt-3">{children}</div>}
        </div>
    );
};

const ExpandedOrderDetails = ({data}) => {
    const itemColumns = useMemo(() => [
        {name: 'Product', selector: row => row.product?.name || 'N/A', sortable: true},
        {name: 'Quantity', selector: row => row.quantity, sortable: true},
        {name: 'UOM', selector: row => row.uom?.name || '—', sortable: true},
        {
            name: "Dimensions",
            cell: row =>
                row.dimension_values?.length ? (
                    <ul className="text-sm text-gray-700 list-disc pl-4">
                        {row.dimension_values.map(d => (
                            <li key={d.id}>
                                {d.dimension?.name || `Dim ${d.dimension_id}`}: {d.value} {d.dimension?.uom?.symbol || ""}
                            </li>
                        ))}
                    </ul>
                ) : "—"
        },
        {
            name: 'Total Price',
            selector: row => `${parseFloat(row.total_price || 0).toFixed(2)} EGP`,
            sortable: true
        }
    ], []);

    const bundleColumns = useMemo(() => [
        {name: 'Bundle', selector: row => row.bundle?.name || 'N/A', sortable: true},
        {name: 'Status', selector: row => row.status || '—', sortable: true},
        {name: 'Progress', selector: row => `${row.progress}%`, sortable: true},
        {name: 'Height', selector: row => row.height, sortable: true},
        {name: 'Levels', selector: row => row.levels, sortable: true},
        {name: 'Lines', selector: row => row.lines_number, sortable: true},
        {name: 'Units/Line', selector: row => row.units_per_line, sortable: true},
        {name: 'Total Units', selector: row => row.total_units, sortable: true},
        {name: 'Houses', selector: row => row.poultry_house_count, sortable: true},
    ], []);

    const paymentColumns = useMemo(() => [
        {name: 'Method', selector: row => row.payment_method, sortable: true},
        {
            name: 'Amount',
            selector: row => `${parseFloat(row.amount || 0).toFixed(2)} EGP`,
            sortable: true
        },
        {name: 'Status', selector: row => row.status, sortable: true},
        {name: 'Reference', selector: row => row.transaction_reference || '—', sortable: false}
    ], []);

    const shipmentColumns = useMemo(() => [
        {name: 'Carrier', selector: row => row.carrier || '—', sortable: true},
        {name: 'Tracking #', selector: row => row.tracking_number || '—', sortable: true},
        {name: 'Status', selector: row => row.status || '—', sortable: true},
        {name: 'Shipped At', selector: row => row.shipped_at || '—', sortable: false},
        {name: 'Delivered At', selector: row => row.delivered_at || '—', sortable: false},
        {name: 'Notes', selector: row => row.notes || '—', sortable: false}
    ], []);

    return (
        <div className="p-4 bg-gray-50 border rounded-xl space-y-5">
            <div className="space-y-1">
                <p className="text-base text-gray-700">
                    <strong>Order Number:</strong> {data?.order_number}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {data?.status} &nbsp;|&nbsp;
                    <strong>Priority:</strong> {data?.priority} &nbsp;|&nbsp;
                    <strong>Ordered At:</strong> {data?.ordered_at}
                </p>
                <p className="text-sm text-gray-600"><strong>Notes:</strong> {data?.notes || '—'}</p>
            </div>

            <Section title="Order Items">
                <DataTable
                    columns={itemColumns}
                    data={data?.order_items || []}
                    noHeader
                    dense
                    striped
                    highlightOnHover
                />
            </Section>

            {data?.bundles?.length > 0 && (
                <Section title="Product Bundles">
                    <DataTable
                        columns={bundleColumns}
                        data={data.bundles}
                        noHeader
                        dense
                        striped
                        highlightOnHover
                    />
                </Section>
            )}

            {data?.payments?.length > 0 && (
                <Section title="Payments">
                    <DataTable
                        columns={paymentColumns}
                        data={data.payments}
                        noHeader
                        dense
                        striped
                        highlightOnHover
                    />
                </Section>
            )}

            {data?.shipments?.length > 0 && (
                <Section title="Shipments">
                    <DataTable
                        columns={shipmentColumns}
                        data={data.shipments}
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

export default ExpandedOrderDetails;
