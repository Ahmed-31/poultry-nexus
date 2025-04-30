import React, {useState, useMemo} from 'react';
import DataTable from 'react-data-table-component';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const Section = ({title, children}) => {
    const [isOpen, setIsOpen] = useState(true);
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

    const {t} = useTranslation();
    const currentLang = useSelector((state) => state.language.current);
    const itemColumns = useMemo(() => [
        {name: t('orderDetails.columns.product'), selector: row => row.product?.name || t('global.na'), sortable: true},
        {name: t('orderDetails.columns.quantity'), selector: row => row.quantity, sortable: true},
        {name: t('orderDetails.columns.uom'), selector: row => row.uom?.name || '—', sortable: true},
        {
            name: t('orderDetails.columns.dimensions'),
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
            name: t('orderDetails.columns.totalPrice'),
            selector: row => `${parseFloat(row.total_price || 0).toFixed(2)} EGP`,
            sortable: true
        }
    ], [t]);

    const bundleColumns = useMemo(() => [
        {name: t('orderDetails.columns.bundle'), selector: row => row.bundle?.name || t('global.na'), sortable: true},
        {name: t('orderDetails.columns.status'), selector: row => t(`orderDetails.status.${row.status}`) || '—', sortable: true},
        {name: t('orderDetails.columns.progress'), selector: row => `${row.progress}%`, sortable: true},
        {
            name: t('orderDetails.columns.parameters'),
            cell: row => row.parameters && Object.keys(row.parameters).length > 0 ? (
                <ul className="text-sm text-gray-700 list-disc pl-4">
                    {Object.entries(row.parameters).map(([key, value]) => (
                        <li key={key}><strong>{key}</strong>: {value}</li>
                    ))}
                </ul>
            ) : '—'
        },
    ], [t]);

    const paymentColumns = useMemo(() => [
        {name: t('orderDetails.columns.method'), selector: row => row.payment_method, sortable: true},
        {
            name: t('orderDetails.columns.amount'),
            selector: row => `${parseFloat(row.amount || 0).toFixed(2)} EGP`,
            sortable: true
        },
        {name: t('orderDetails.columns.status'), selector: row => row.status, sortable: true},
        {name: t('orderDetails.columns.reference'), selector: row => row.transaction_reference || '—', sortable: false}
    ], [t]);

    const shipmentColumns = useMemo(() => [
        {name: t('orderDetails.columns.carrier'), selector: row => row.carrier || '—', sortable: true},
        {name: t('orderDetails.columns.tracking'), selector: row => row.tracking_number || '—', sortable: true},
        {name: t('orderDetails.columns.status'), selector: row => row.status || '—', sortable: true},
        {name: t('orderDetails.columns.shippedAt'), selector: row => row.shipped_at || '—', sortable: false},
        {name: t('orderDetails.columns.deliveredAt'), selector: row => row.delivered_at || '—', sortable: false},
        {name: t('orderDetails.columns.notes'), selector: row => row.notes || '—', sortable: false}
    ], [t]);

    return (
        <div className="p-4 bg-gray-50 border rounded-xl space-y-5">
            <div className="space-y-1">
                <p className="text-base text-gray-700">
                    <strong>{t('orderDetails.meta.orderNumber')}</strong> {data?.order_number}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>{t('orderDetails.columns.status')}:</strong> {data?.status} &nbsp;|&nbsp;
                    {/*todo: add priority string.*/}
                    <strong>{t('orderDetails.meta.priority')}:</strong> {data?.priority} &nbsp;|&nbsp;
                    <strong>{t('orderDetails.meta.orderedAt')}:</strong> {data?.ordered_at}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>{t('orderDetails.meta.notes')}:</strong> {data?.notes || '—'}</p>
            </div>

            <Section title={t('orderDetails.sections.items')}>
                <DataTable
                    key={currentLang}
                    columns={itemColumns}
                    data={data?.order_items || []}
                    noHeader
                    dense
                    striped
                    highlightOnHover
                />
            </Section>

            {data?.bundles?.length > 0 && (
                <Section title={t('orderDetails.sections.bundles')}>
                    <DataTable
                        key={currentLang}
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
                <Section title={t('orderDetails.sections.payments')}>
                    <DataTable
                        key={currentLang}
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
                <Section title={t('orderDetails.sections.shipments')}>
                    <DataTable
                        key={currentLang}
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
