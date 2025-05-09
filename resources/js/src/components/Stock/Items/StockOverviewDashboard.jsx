import React, {useEffect, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchStock} from "@/src/store/stockSlice.jsx";
import {fetchStockMovements} from "@/src/store/stockMovementsSlice.jsx";
import {fetchWarehouses} from "@/src/store/warehouseSlice.jsx";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend} from "recharts";
import {Card, CardContent} from "@/Components/ui/card.jsx";
import ActionHandler from "@/src/components/common/ActionHandler.jsx";
import {useTranslation} from "react-i18next";

const StockOverviewDashboard = () => {
    const {t} = useTranslation();
    const quickActions = {
        operations: [
            {
                title: "Manual Stock Scan",
                icon: "📝",
                action: "Go to Scan",
                type: "navigate",
                route: "/stock/update-manual",
                key: "manualScan"
            },
            {title: "Add Stock Entry", icon: "📥", action: "+ Add Stock", type: "modal", key: "addStock",},
            {title: "Remove Stock", icon: "📤", action: "- Issue Stock", type: "modal", key: "issueStock",},
            {title: "Transfer Stock", icon: "📦", action: "↔ Transfer Stock", type: "modal", key: "transferStock",},
            {
                title: "Create Purchase",
                icon: "🛒",
                action: "+ Create PO",
                type: "navigate",
                route: "/purchases/create",
                key: "createPurchase"
            },
            {
                title: "Stock Report",
                icon: "📊",
                action: "📄 Generate Report",
                type: "navigate",
                route: "/stock/report",
                key: "stockReport"
            },
            {title: "Stock Adjustment", icon: "⚙️", action: "✏ Adjust Quantity", type: "modal", key: "adjustStock",},
            {title: "Stock Count", icon: "📋", action: "📦 Start Count", type: "modal", key: "stockCount",},
            {
                title: "Stock History",
                icon: "📜",
                action: "📖 View Ledger",
                type: "navigate",
                route: "/stock/stock-movements",
                key: "stockHistory"
            },
        ],
        masterData: [
            {title: "Create Item", icon: "📄", action: "+ New Item", type: "modal", key: "createItem",},
            {title: "Edit Item", icon: "✏️", action: "🛠 Edit Item", type: "modal", key: "editItem",},
            {title: "Remove Item", icon: "🗑️", action: "❌ Delete Item", type: "modal", key: "removeItem",},
            {title: "Create Warehouse", icon: "🏠", action: "+ New Warehouse", type: "modal", key: "createWarehouse",},
            {title: "Edit Warehouse", icon: "🛠", action: "✏️ Edit Warehouse", type: "modal", key: "editWarehouse",},
            {
                title: "Remove Warehouse",
                icon: "🚫",
                action: "🗑 Delete Warehouse",
                type: "modal",
                key: "removeWarehouse",
            },
            {
                title: "View All Items",
                icon: "📋",
                action: "📦 Item List",
                type: "navigate",
                route: "/stock/products",
                key: "viewItems"
            },
            {title: "Manage UoM", icon: "📏", action: "⚖ Unit Setup", type: "navigate", route: "/uom", key: "manageUoM"},
            {title: "Set Stock Thresholds", icon: "⚠️", action: "📉 Min/Max Levels", type: "modal", key: "thresholds",},
            {title: "Bulk Import Items", icon: "📂", action: "⬆ Upload Excel", type: "wizard", key: "bulkImportItems",},
            {
                title: "Export Items",
                icon: "📤",
                action: "⬇ Download Excel",
                type: "navigate",
                route: "/items/export",
                key: "exportItems"
            },
            {
                title: "Manage Categories",
                icon: "🗂",
                action: "📁 Item Groups",
                type: "navigate",
                route: "/categories",
                key: "manageCategories"
            },
        ],
        alerts: [
            {
                title: "Low Stock Alerts",
                icon: "🚨",
                action: "⚠ View Alerts",
                type: "navigate",
                route: "/alerts/low-stock",
                key: "lowStockAlerts"
            },
            // Future enhancement:
            // {
            //   title: "Reorder Suggestions",
            //   icon: "🔁",
            //   action: "📦 Suggest Reorder",
            //   type: "navigate",
            //   route: "/alerts/reorder-suggestions",
            // },
        ],
    };


    const kpis = [
        {label: t('stockDashboard.kpis.totalItems'), value: "25,000"},
        {label: t('stockDashboard.kpis.outOfStock'), value: "12"},
        {label: t('stockDashboard.kpis.lowStockAlerts'), value: "38"},
        {label: t('stockDashboard.kpis.totalValue'), value: "$420,000"},
    ];

    const recentMovements = [
        {
            date: "2025-03-24",
            product: "Wire Spool A",
            uom: "Meter",
            action: "Inbound",
            qty: 200,
            warehouse: "WH-1",
            user: "Omar"
        },
        {
            date: "2025-03-23",
            product: "Lubricant 5L",
            uom: "Litre",
            action: "Outbound",
            qty: 12,
            warehouse: "WH-2",
            user: "Sarah"
        },
    ];

    const warehouses = [
        {name: "WH-1", capacityUsed: 76, status: "Normal"},
        {name: "WH-2", capacityUsed: 98, status: "Full"},
        {name: "WH-3", capacityUsed: 45, status: "Normal"},
    ];

    const categoryData = [
        {category: "Finished Products", quantity: 10000},
        {category: "Raw Materials", quantity: 8500},
        {category: "Consumables", quantity: 4500},
        {category: "Miscellaneous", quantity: 1000},
    ];
    const dispatch = useDispatch();

    const stock = useSelector((state) => state.stock.list || []);
    const stockMovements = useSelector((state) => state.stockMovements.list || []);
    const loading = useSelector((state) => state.stock.loading || state.stockMovements.loading);

    useEffect(() => {
        dispatch(fetchStock());
        dispatch(fetchStockMovements());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    const stockTrendData = useMemo(() => stockMovements.slice(-7).map((movement) => ({
        name: new Date(movement.movement_date).toLocaleDateString(),
        quantity: movement.quantity,
        type: movement.movement_type,
    })), [stockMovements]);

    const warehouseCapacityData = useMemo(() => warehouses.map((warehouse) => ({
        name: warehouse.name,
        used: stock.filter((item) => item.warehouse?.id === warehouse?.id).reduce((sum, item) => sum + item.quantity, 0),
        capacity: warehouse.maximum_capacity || 1000, // Default to 1000 if not set
    })), [warehouses, stock]);

    const lowStockItems = useMemo(() => stock.filter(item => item.quantity < item.minimum_stock_level), [stock]);

    return (
        <div className="p-6 space-y-6 min-w-[1200px]">
            <div className="space-y-10 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
                {Object.entries(quickActions).map(([section, actions]) => (
                    <div key={section}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 capitalize">
                            {section === "operations"
                                ? "🚚 " + t('stockDashboard.sections.operations')
                                : section === "masterData"
                                    ? "🗃️ " + t('stockDashboard.sections.masterData')
                                    : section === "alerts"
                                        ? "🚨 " + t('stockDashboard.sections.alerts')
                                        : section}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                            {actions.map((action, idx) => (
                                <Card
                                    key={idx}
                                    className="hover:shadow-2xl transition-shadow"
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <div className="text-4xl mb-3">{action.icon}</div>
                                        <div className="font-semibold text-center text-lg">
                                            {t(`stockDashboard.actions.${action.key}.title`)}
                                        </div>
                                        <ActionHandler action={{
                                            ...action,
                                            action: t(`stockDashboard.actions.${action.key}.action`)
                                        }}/>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => (
                    <Card key={idx} className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <div className="text-sm text-muted-foreground">{kpi.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-2">{t('stockDashboard.sections.recentMovements')}</h2>
                <div className="overflow-auto">
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">{t('stockDashboard.table.date')}</th>
                                <th className="px-4 py-2 border">{t('stockDashboard.table.product')}</th>
                                <th className="px-4 py-2 border">{t('stockDashboard.table.uom')}</th>
                                <th className="px-4 py-2 border">{t('stockDashboard.table.action')}</th>
                                <th className="px-4 py-2 border">{t('stockDashboard.table.qty')}</th>
                                <th className="px-4 py-2 border">{t('stockDashboard.table.warehouse')}</th>
                                <th className="px-4 py-2 border">{t('stockDashboard.table.user')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentMovements.map((move, idx) => (
                                <tr key={idx} className="text-center">
                                    <td className="px-4 py-2 border">{move.date}</td>
                                    <td className="px-4 py-2 border">{move.product}</td>
                                    <td className="px-4 py-2 border">{move.uom}</td>
                                    <td className="px-4 py-2 border">{move.action}</td>
                                    <td className="px-4 py-2 border">{move.qty}</td>
                                    <td className="px-4 py-2 border">{move.warehouse}</td>
                                    <td className="px-4 py-2 border">{move.user}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-2">{t('stockDashboard.sections.warehouseOverview')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {warehouses.map((wh, idx) => (
                        <Card key={idx}>
                            <CardContent className="p-4">
                                <div className="text-lg font-semibold">{wh.name}</div>
                                <div>{t('stockDashboard.warehouse.capacityUsed')}: {wh.capacityUsed}%</div>
                                <div>{t('stockDashboard.warehouse.status')}: {wh.status === "Full" ? "🔴 " + t('stockDashboard.warehouse.full') : "🟢 " + t('stockDashboard.warehouse.normal')}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">{t('stockDashboard.sections.stockByCategory')}</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData} margin={{top: 10, right: 30, left: 0, bottom: 5}}>
                        <XAxis dataKey="category"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="quantity" fill="#3b82f6" name={t('stockDashboard.charts.quantity')}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StockOverviewDashboard;
