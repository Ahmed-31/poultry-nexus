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

const Section = ({icon, title, children}) => (
    <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <div className="flex items-center mb-4 gap-2">
            {icon}
            <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        {children}
    </div>
);

const StockLevelsMovements = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');

    const stock = useSelector((state) => state.stock.list || []);
    const movementsTable = useSelector((state) => state.stockMovements.dataTable || []);
    const products = useSelector((state) => state.products.list || []);
    const warehouses = useSelector((state) => state.warehouses.list || []);

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
            inbound: {text: 'Inbound', className: 'bg-green-100 text-green-700'},
            outbound: {text: 'Outbound', className: 'bg-red-100 text-red-700'},
            adjustment: {text: 'Adjustment', className: 'bg-yellow-100 text-yellow-800'},
        };
        const badge = map[type] || {text: type, className: 'bg-gray-100 text-gray-700'};
        return <Badge className={badge.className}>{badge.text}</Badge>;
    };

    const stockColumns = [
        {
            name: 'Product',
            selector: row => getProductName(row.product_id),
            sortable: true,
        },
        {
            name: 'Warehouse',
            selector: row => getWarehouseName(row.warehouse_id),
            sortable: true,
        },
        {
            name: 'Available Stock',
            selector: row => row.quantity_in_base,
            sortable: true,
        },
        {
            name: 'Reserved',
            selector: row => row.reserved_quantity || 0,
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <span
                    className={`px-2 py-1 rounded text-sm text-white font-medium ${
                        row.quantity_in_base < (row.minimum_stock_level || 0)
                            ? 'bg-red-500'
                            : 'bg-green-500'
                    }`}
                >
                    {row.quantity_in_base < (row.minimum_stock_level || 0) ? 'Low Stock' : 'Sufficient'}
                </span>
            ),
        },
    ];

    const historyColumns = [
        {
            name: 'Date',
            selector: row => new Date(row.movement_date).toLocaleString(),
            sortable: true,
        },
        {
            name: 'Product',
            selector: row => getProductName(row.product_id),
            sortable: true,
        },
        {
            name: 'Warehouse',
            selector: row => getWarehouseName(row.warehouse_id),
            sortable: true,
        },
        {
            name: 'Type',
            cell: row => getBadge(row.movement_type),
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => `${row.movement_type === 'outbound' ? '-' : '+'}${row.quantity}`,
            sortable: true,
        },
        {
            name: 'Reason',
            selector: row => row.reason || '-',
        },
        {
            name: 'Balance',
            selector: row => row.running_balance,
            sortable: true,
        },
    ];

    return (
        <div className="p-6 max-w-screen-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <FaBoxOpen className="text-blue-600"/>
                Stock Levels & History
            </h1>

            <div className="flex items-center gap-4 mb-6">
                <FaSearch className="text-gray-400"/>
                <Input
                    placeholder="Search product, warehouse, or reason..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-xl"
                />
            </div>

            <Section icon={<FaWarehouse className="text-gray-500"/>} title="Current Stock Levels">
                <DataTable
                    columns={stockColumns}
                    data={filteredStock}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    persistTableHead
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                />
            </Section>

            <Section icon={<FaHistory className="text-gray-500"/>} title="Stock Movement Ledger">
                <DataTable
                    columns={historyColumns}
                    data={movementsWithBalance}
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
