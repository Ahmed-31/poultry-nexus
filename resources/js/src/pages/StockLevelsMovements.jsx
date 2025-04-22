import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchStock} from '@/src/store/stockSlice';
import {fetchStockMovementsTable} from '@/src/store/stockMovementsSlice';
import {fetchProducts} from '@/src/store/productsSlice';
import {fetchWarehouses} from '@/src/store/warehouseSlice';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import DataTable from 'react-data-table-component';
import {FaWarehouse, FaBoxOpen, FaHistory, FaSearch} from 'react-icons/fa';
import {Button} from "@/Components/ui/button.jsx";
import {useTranslation} from "react-i18next";

const RefreshButton = ({onClick}) => {
    const {t} = useTranslation();
    return (
        <Button
            onClick={onClick}
            variant="outline"
            className="w-36"
        >
            🔄 {t('global.refresh')}
        </Button>
    );
};

const Section = ({icon, title, actions = null, children}) => (
    <section className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
        <header className="flex flex-wrap items-center justify-between mb-5 gap-3">
            <div className="flex items-center gap-3">
                {icon}
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            {actions}
        </header>
        {children}
    </section>
);

const StockLevelsMovements = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');

    const stock = useSelector((state) => state.stock.list || []);
    const stockLoading = useSelector((state) => state.stock.loading);
    const movementsTable = useSelector((state) => state.stockMovements.dataTable || []);
    const movementsTableLoading = useSelector((state) => state.stockMovements.loading);
    const products = useSelector((state) => state.products.list || []);
    const warehouses = useSelector((state) => state.warehouses.list || []);
    const currentLang = useSelector((state) => state.language.current);

    useEffect(() => {
        dispatch(fetchStock());
        dispatch(fetchStockMovementsTable());
        dispatch(fetchProducts());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    const getProductName = (id) => products.find(p => p.id === id)?.name || `#${id}`;
    const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || `#${id}`;

    const filteredStock = useMemo(() => {
        return stock.filter(item => {
            const product = getProductName(item.product_id).toLowerCase();
            const warehouse = getWarehouseName(item.warehouse_id).toLowerCase();
            return product.includes(search.toLowerCase()) || warehouse.includes(search.toLowerCase());
        });
    }, [stock, search, products, warehouses]);

    const filteredMovements = useMemo(() => {
        return movementsTable.filter(m => {
            const product = getProductName(m.product_id).toLowerCase();
            const warehouse = getWarehouseName(m.warehouse_id).toLowerCase();
            const reason = (m.reason || '').toLowerCase();
            return (
                product.includes(search.toLowerCase()) ||
                warehouse.includes(search.toLowerCase()) ||
                reason.includes(search.toLowerCase())
            );
        });
    }, [movementsTable, search, products, warehouses]);

    const movementsWithBalance = useMemo(() => {
        let balance = 0;
        return [...filteredMovements]
            .sort((a, b) => new Date(a.movement_date) - new Date(b.movement_date))
            .map(m => {
                const qty = m.movement_type === 'outbound' ? -m.quantity : m.quantity;
                balance += qty;
                return {...m, running_balance: balance};
            });
    }, [filteredMovements]);

    const getBadge = (type) => {
        const map = {
            inbound: {text: t('stockLevels.types.inbound'), className: 'bg-green-100 text-green-700'},
            outbound: {text: t('stockLevels.types.outbound'), className: 'bg-red-100 text-red-700'},
            adjustment: {text: t('stockLevels.types.adjustment'), className: 'bg-yellow-100 text-yellow-800'},
        };
        const badge = map[type] || {text: type, className: 'bg-gray-100 text-gray-700'};
        return <Badge className={badge.className}>{badge.text}</Badge>;
    };

    const stockColumns = [
        {
            name: t('stockLevels.columns.product'),
            selector: row => getProductName(row.product_id),
            sortable: true,
            grow: 2,
        },
        {
            name: t('stockLevels.columns.warehouse'),
            selector: row => getWarehouseName(row.warehouse_id),
            sortable: true,
            grow: 2,
        },
        {
            name: t('stockLevels.columns.available'),
            selector: row => row.quantity_in_base,
            sortable: true,
            right: "true",
        },
        {
            name: t('stockLevels.columns.reserved'),
            selector: row => row.reserved_quantity || 0,
            sortable: true,
            right: "true",
        },
        {
            name: t('stockLevels.columns.status'),
            cell: row => (
                <span
                    className={`px-2 py-1 rounded text-sm text-white font-medium ${
                        row.quantity_in_base < (row.minimum_stock_level || 0)
                            ? 'bg-red-500'
                            : 'bg-green-500'
                    }`}
                >
                    {row.quantity_in_base < (row.minimum_stock_level || 0) ? t('stockLevels.status.low') : t('stockLevels.status.sufficient')}
                </span>
            ),
        },
    ];

    const historyColumns = [
        {
            name: t('stockLevels.columns.date'),
            selector: row => new Date(row.movement_date).toLocaleString(),
            sortable: true,
            grow: 2,
        },
        {
            name: t('stockLevels.columns.product'),
            selector: row => getProductName(row.product_id),
            sortable: true,
            grow: 2,
        },
        {
            name: t('stockLevels.columns.warehouse'),
            selector: row => getWarehouseName(row.warehouse_id),
            sortable: true,
            grow: 2,
        },
        {
            name: t('stockLevels.columns.type'),
            cell: row => getBadge(row.movement_type),
            sortable: true,
        },
        {
            name: t('stockLevels.columns.quantity'),
            selector: row => `${row.movement_type === 'outbound' ? '-' : '+'}${row.quantity}`,
            sortable: true,
            right: "true",
        },
        {
            name: t('stockLevels.columns.reason'),
            selector: row => row.reason || '-',
            sortable: false,
            grow: 2,
        },
        {
            name: t('stockLevels.columns.balance'),
            selector: row => row.running_balance,
            sortable: true,
            right: "true",
        },
    ];

    return (
        <div className="p-6 max-w-screen-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
                <FaBoxOpen className="text-blue-600"/>
                {t('stockLevels.title')}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-8">
                <div className="relative sm:col-span-2">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <Input
                        placeholder={t('stockLevels.searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
            </div>

            <Section
                icon={<FaWarehouse className="text-gray-500"/>}
                title={t('stockLevels.sections.current')}
                actions={<RefreshButton onClick={() => dispatch(fetchStock())}/>}
            >
                <DataTable
                    key={currentLang}
                    columns={stockColumns}
                    data={filteredStock}
                    progressPending={stockLoading}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    persistTableHead
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                />
            </Section>

            <Section
                icon={<FaHistory className="text-gray-500"/>}
                title={t('stockLevels.sections.ledger')}
                actions={<RefreshButton onClick={() => dispatch(fetchStockMovementsTable())}/>}
            >
                <DataTable
                    key={currentLang}
                    columns={historyColumns}
                    data={movementsWithBalance}
                    progressPending={movementsTableLoading}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    persistTableHead
                    fixedHeader
                    fixedHeaderScrollHeight="500px"
                    defaultSortFieldId={1}
                    defaultSortAsc={false}
                />
            </Section>
        </div>
    );
};

export default StockLevelsMovements;
