import React, {useState} from 'react';
import DataTable from 'react-data-table-component';

const Section = ({title, children}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white border rounded-lg p-4 shadow mb-4">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="font-semibold text-lg">{title}</h4>
                <span>{isOpen ? '▼' : '▶'}</span>
            </div>
            {isOpen && <div className="mt-2">{children}</div>}
        </div>
    );
};

const ExpandedOrderDetails = ({data}) => {
    const itemColumns = [
        {name: 'Product', selector: row => row.product?.name || 'N/A', sortable: true},
        {name: 'Quantity', selector: row => row.quantity, sortable: true},
        {name: 'Total Price', selector: row => `$${parseFloat(row.total_price || 0).toFixed(2)}`, sortable: true},
    ];

    const bundleColumns = [
        {name: 'Bundle Name', selector: row => row.bundle?.name || 'N/A', sortable: true},
        {name: 'Description', selector: row => row.bundle?.description || 'N/A', sortable: false},
        {name: 'Height', selector: row => row.height, sortable: true},
        {name: 'Levels', selector: row => row.levels, sortable: true},
        {name: 'Lines Count', selector: row => row.lines_number, sortable: true},
        {name: 'Units Per Line', selector: row => row.units_per_line, sortable: true},
        {name: 'Total Units', selector: row => row.total_units, sortable: true},
        {name: 'Poultry House Count', selector: row => row.poultry_house_count, sortable: true},
    ];

    const paymentColumns = [
        {name: 'Method', selector: row => row.payment_method, sortable: true},
        {name: 'Amount', selector: row => `$${parseFloat(row.amount || 0).toFixed(2)}`, sortable: true},
        {name: 'Status', selector: row => row.status, sortable: true},
    ];

    const shipmentColumns = [
        {name: 'Carrier', selector: row => row.carrier, sortable: true},
        {name: 'Tracking Number', selector: row => row.tracking_number, sortable: true},
        {name: 'Status', selector: row => row.status, sortable: true},
    ];

    return (
        <div className="p-4 bg-gray-50 border rounded space-y-4">
            <h3 className="text-xl font-bold mb-4">Order Details: {data.order_number}</h3>

            <Section title="Order Items">
                <DataTable columns={itemColumns} data={data.order_items || []} noHeader dense striped highlightOnHover/>
            </Section>

            {data.bundles.length > 0 && (
                <Section title="Order Bundles">
                    <DataTable columns={bundleColumns} data={data.bundles} noHeader dense striped highlightOnHover/>
                </Section>
            )}

            {data.payments.length > 0 && (
                <Section title="Payments">
                    <DataTable columns={paymentColumns} data={data.payments} noHeader dense striped highlightOnHover/>
                </Section>
            )}

            {data.shipments.length > 0 && (
                <Section title="Shipments">
                    <DataTable columns={shipmentColumns} data={data.shipments} noHeader dense striped highlightOnHover/>
                </Section>
            )}
        </div>
    );
};

export default ExpandedOrderDetails;
