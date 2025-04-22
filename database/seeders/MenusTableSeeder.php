<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenusTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('menus')->truncate();

        $menus = [
            ['title' => 'menu.system_overview', 'url' => '/', 'icon' => 'Layout', 'parent_id' => null, 'order' => 1],

            ['title' => 'menu.stock', 'url' => '/stock', 'icon' => 'Box', 'parent_id' => null, 'order' => 2],
            ['title' => 'menu.stock.dashboard', 'url' => '/stock/dashboard', 'icon' => 'Package', 'parent_id' => 2, 'order' => 1],
            ['title' => 'menu.stock.list', 'url' => '/stock/list', 'icon' => 'Cogs', 'parent_id' => 2, 'order' => 2],
            ['title' => 'menu.stock.movements', 'url' => '/stock/stock-movements', 'icon' => 'BarChart', 'parent_id' => 2, 'order' => 3],
            ['title' => 'menu.stock.warehouses', 'url' => '/stock/warehouses', 'icon' => 'CheckCircle', 'parent_id' => 2, 'order' => 4],
            ['title' => 'menu.stock.products', 'url' => '/stock/products', 'icon' => 'Package', 'parent_id' => 2, 'order' => 5],

            ['title' => 'menu.production', 'url' => '/production', 'icon' => 'Gears', 'parent_id' => null, 'order' => 3],
            ['title' => 'menu.production.orders', 'url' => '/production/orders', 'icon' => 'ClipboardList', 'parent_id' => 8, 'order' => 1],
            ['title' => 'menu.production.processes', 'url' => '/production/processes', 'icon' => 'Industry', 'parent_id' => 8, 'order' => 2],
            ['title' => 'menu.production.assembly', 'url' => '/production/assembly', 'icon' => 'ConveyorBelt', 'parent_id' => 8, 'order' => 3],
            ['title' => 'menu.production.maintenance', 'url' => '/production/machine-maintenance', 'icon' => 'Tools', 'parent_id' => 8, 'order' => 4],

            ['title' => 'menu.quality', 'url' => '/quality-control', 'icon' => 'ShieldCheck', 'parent_id' => null, 'order' => 4],
            ['title' => 'menu.quality.reports', 'url' => '/quality-control/inspection-reports', 'icon' => 'ClipboardCheck', 'parent_id' => 13, 'order' => 1],
            ['title' => 'menu.quality.compliance', 'url' => '/quality-control/compliance-safety', 'icon' => 'Shield', 'parent_id' => 13, 'order' => 2],

            ['title' => 'menu.orders', 'url' => '/orders', 'icon' => 'Cart', 'parent_id' => null, 'order' => 5],
            ['title' => 'menu.orders.client', 'url' => '/orders', 'icon' => 'UserCheck', 'parent_id' => 16, 'order' => 1],
            ['title' => 'menu.orders.custom', 'url' => '/orders/custom-requests', 'icon' => 'Wrench', 'parent_id' => 16, 'order' => 2],
            ['title' => 'menu.orders.scheduling', 'url' => '/orders/scheduling', 'icon' => 'Calendar', 'parent_id' => 16, 'order' => 3],

            ['title' => 'menu.logistics', 'url' => '/logistics', 'icon' => 'Truck', 'parent_id' => null, 'order' => 6],
            ['title' => 'menu.logistics.tracking', 'url' => '/logistics/shipment-tracking', 'icon' => 'MapPin', 'parent_id' => 20, 'order' => 1],
            ['title' => 'menu.logistics.fleet', 'url' => '/logistics/fleet-management', 'icon' => 'Truck', 'parent_id' => 20, 'order' => 2],
            ['title' => 'menu.logistics.warehouse', 'url' => '/logistics/warehouse', 'icon' => 'Home', 'parent_id' => 20, 'order' => 3],

            ['title' => 'menu.procurement', 'url' => '/procurement', 'icon' => 'ShoppingBag', 'parent_id' => null, 'order' => 7],
            ['title' => 'menu.procurement.requests', 'url' => '/procurement/requests', 'icon' => 'ClipboardList', 'parent_id' => 24, 'order' => 1],
            ['title' => 'menu.procurement.vendors', 'url' => '/procurement/vendors', 'icon' => 'Users', 'parent_id' => 24, 'order' => 2],
            ['title' => 'menu.procurement.orders', 'url' => '/procurement/orders', 'icon' => 'FileText', 'parent_id' => 24, 'order' => 3],

            ['title' => 'menu.sales', 'url' => '/sales-distribution', 'icon' => 'DollarSign', 'parent_id' => null, 'order' => 8],
            ['title' => 'menu.sales.orders', 'url' => '/sales-distribution/orders', 'icon' => 'DollarSign', 'parent_id' => 28, 'order' => 1],
            ['title' => 'menu.sales.customers', 'url' => '/sales-distribution/customers', 'icon' => 'Users', 'parent_id' => 28, 'order' => 2],
            ['title' => 'menu.sales.contracts', 'url' => '/sales-distribution/pricing', 'icon' => 'FileSignature', 'parent_id' => 28, 'order' => 3],

            ['title' => 'menu.finance', 'url' => '/accounting', 'icon' => 'Banknote', 'parent_id' => null, 'order' => 9],
            ['title' => 'menu.finance.invoices', 'url' => '/accounting/invoices', 'icon' => 'Receipt', 'parent_id' => 32, 'order' => 1],
            ['title' => 'menu.finance.expenses', 'url' => '/accounting/expenses', 'icon' => 'Wallet', 'parent_id' => 32, 'order' => 2],
            ['title' => 'menu.finance.cost', 'url' => '/accounting/cost-analysis', 'icon' => 'BarChart2', 'parent_id' => 32, 'order' => 3],

            ['title' => 'menu.hr', 'url' => '/hr', 'icon' => 'UserCog', 'parent_id' => null, 'order' => 10],
            ['title' => 'menu.hr.employees', 'url' => '/hr/employee-management', 'icon' => 'UserCog', 'parent_id' => 36, 'order' => 1],
            ['title' => 'menu.hr.payroll', 'url' => '/hr/payroll-processing', 'icon' => 'BadgeDollarSign', 'parent_id' => 36, 'order' => 2],
            ['title' => 'menu.hr.scheduling', 'url' => '/hr/workforce-scheduling', 'icon' => 'CalendarCheck', 'parent_id' => 36, 'order' => 3],

            ['title' => 'menu.reports', 'url' => '/reports', 'icon' => 'TrendingUp', 'parent_id' => null, 'order' => 11],
            ['title' => 'menu.reports.production', 'url' => '/reports/production-performance', 'icon' => 'TrendingUp', 'parent_id' => 40, 'order' => 1],
            ['title' => 'menu.reports.turnover', 'url' => '/reports/stock-turnover', 'icon' => 'RefreshCw', 'parent_id' => 40, 'order' => 2],
            ['title' => 'menu.reports.sales', 'url' => '/reports/sales-revenue', 'icon' => 'BarChart2', 'parent_id' => 40, 'order' => 3],
            ['title' => 'menu.reports.compliance', 'url' => '/reports/quality-compliance', 'icon' => 'CheckCircle', 'parent_id' => 40, 'order' => 4],
        ];

        foreach ($menus as $menu) {
            DB::table('menus')->insert($menu);
        }
    }
}
