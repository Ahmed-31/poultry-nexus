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
            ['title' => 'System Overview', 'url' => '/', 'icon' => 'Layout', 'parent_id' => null, 'order' => 1],

            ['title' => 'Inventory Management', 'url' => '/inventory', 'icon' => 'Box', 'parent_id' => null, 'order' => 2],
            ['title' => 'Raw Materials', 'url' => '/inventory/raw-materials', 'icon' => 'Package', 'parent_id' => 2, 'order' => 1],
            ['title' => 'Pre-Made Components', 'url' => '/inventory/pre-made-components', 'icon' => 'Cogs', 'parent_id' => 2, 'order' => 2],
            ['title' => 'Finished Products', 'url' => '/inventory/finished-products', 'icon' => 'CheckCircle', 'parent_id' => 2, 'order' => 3],
            ['title' => 'Stock Levels & Movements', 'url' => '/inventory/stock-levels', 'icon' => 'BarChart', 'parent_id' => 2, 'order' => 4],

            ['title' => 'Production & Processing', 'url' => '/production', 'icon' => 'Gears', 'parent_id' => null, 'order' => 3],
            ['title' => 'Production Orders', 'url' => '/production/orders', 'icon' => 'ClipboardList', 'parent_id' => 7, 'order' => 1],
            ['title' => 'Manufacturing Processes', 'url' => '/production/processes', 'icon' => 'Industry', 'parent_id' => 7, 'order' => 2],
            ['title' => 'Assembly Line Management', 'url' => '/production/assembly', 'icon' => 'ConveyorBelt', 'parent_id' => 7, 'order' => 3],
            ['title' => 'Machine Maintenance & Downtime Tracking', 'url' => '/production/machine-maintenance', 'icon' => 'Tools', 'parent_id' => 7, 'order' => 4],

            ['title' => 'Quality Control', 'url' => '/quality-control', 'icon' => 'ShieldCheck', 'parent_id' => null, 'order' => 4],
            ['title' => 'Inspection Reports', 'url' => '/quality-control/inspection-reports', 'icon' => 'ClipboardCheck', 'parent_id' => 12, 'order' => 1],
            ['title' => 'Compliance & Safety Tracking', 'url' => '/quality-control/compliance-safety', 'icon' => 'Shield', 'parent_id' => 12, 'order' => 2],

            ['title' => 'Order Processing', 'url' => '/orders', 'icon' => 'Cart', 'parent_id' => null, 'order' => 5],
            ['title' => 'Client Orders', 'url' => '/orders', 'icon' => 'UserCheck', 'parent_id' => 15, 'order' => 1],
            ['title' => 'Custom Manufacturing Requests', 'url' => '/orders/custom-requests', 'icon' => 'Wrench', 'parent_id' => 15, 'order' => 2],
            ['title' => 'Production Scheduling', 'url' => '/orders/scheduling', 'icon' => 'Calendar', 'parent_id' => 15, 'order' => 3],

            ['title' => 'Logistics & Supply Chain', 'url' => '/logistics', 'icon' => 'Truck', 'parent_id' => null, 'order' => 6],
            ['title' => 'Shipment Tracking', 'url' => '/logistics/shipment-tracking', 'icon' => 'MapPin', 'parent_id' => 19, 'order' => 1],
            ['title' => 'Fleet & Transportation Management', 'url' => '/logistics/fleet-management', 'icon' => 'Truck', 'parent_id' => 19, 'order' => 2],
            ['title' => 'Warehouse Management', 'url' => '/logistics/warehouse', 'icon' => 'Home', 'parent_id' => 19, 'order' => 3],

            ['title' => 'Procurement', 'url' => '/procurement', 'icon' => 'ShoppingBag', 'parent_id' => null, 'order' => 7],
            ['title' => 'Purchase Requests', 'url' => '/procurement/requests', 'icon' => 'ClipboardList', 'parent_id' => 23, 'order' => 1],
            ['title' => 'Vendor Management', 'url' => '/procurement/vendors', 'icon' => 'Users', 'parent_id' => 23, 'order' => 2],
            ['title' => 'Purchase Orders', 'url' => '/procurement/orders', 'icon' => 'FileText', 'parent_id' => 23, 'order' => 3],

            ['title' => 'Sales & Distribution', 'url' => '/sales-distribution', 'icon' => 'DollarSign', 'parent_id' => null, 'order' => 8],
            ['title' => 'Sales Orders', 'url' => '/sales-distribution/orders', 'icon' => 'DollarSign', 'parent_id' => 27, 'order' => 1],
            ['title' => 'Customer Management', 'url' => '/sales-distribution/customers', 'icon' => 'Users', 'parent_id' => 27, 'order' => 2],
            ['title' => 'Contract & Pricing Management', 'url' => '/sales-distribution/pricing', 'icon' => 'FileSignature', 'parent_id' => 27, 'order' => 3],

            ['title' => 'Accounting & Finance', 'url' => '/accounting', 'icon' => 'Banknote', 'parent_id' => null, 'order' => 9],
            ['title' => 'Invoices & Payments', 'url' => '/accounting/invoices', 'icon' => 'Receipt', 'parent_id' => 31, 'order' => 1],
            ['title' => 'Expenses & Budgeting', 'url' => '/accounting/expenses', 'icon' => 'Wallet', 'parent_id' => 31, 'order' => 2],
            ['title' => 'Cost Analysis', 'url' => '/accounting/cost-analysis', 'icon' => 'BarChart2', 'parent_id' => 31, 'order' => 3],

            ['title' => 'HR & Payroll', 'url' => '/hr', 'icon' => 'UserCog', 'parent_id' => null, 'order' => 10],
            ['title' => 'Employee Management', 'url' => '/hr/employee-management', 'icon' => 'UserCog', 'parent_id' => 35, 'order' => 1],
            ['title' => 'Payroll Processing', 'url' => '/hr/payroll-processing', 'icon' => 'BadgeDollarSign', 'parent_id' => 35, 'order' => 2],
            ['title' => 'Workforce Scheduling', 'url' => '/hr/workforce-scheduling', 'icon' => 'CalendarCheck', 'parent_id' => 35, 'order' => 3],

            ['title' => 'Reports & Analytics', 'url' => '/reports', 'icon' => 'TrendingUp', 'parent_id' => null, 'order' => 11],
            ['title' => 'Production Performance', 'url' => '/reports/production-performance', 'icon' => 'TrendingUp', 'parent_id' => 39, 'order' => 1],
            ['title' => 'Inventory Turnover', 'url' => '/reports/inventory-turnover', 'icon' => 'RefreshCw', 'parent_id' => 39, 'order' => 2],
            ['title' => 'Sales & Revenue Reports', 'url' => '/reports/sales-revenue', 'icon' => 'BarChart2', 'parent_id' => 39, 'order' => 3],
            ['title' => 'Quality & Compliance Reports', 'url' => '/reports/quality-compliance', 'icon' => 'CheckCircle', 'parent_id' => 39, 'order' => 4],
        ];

        foreach ($menus as $menu) {
            DB::table('menus')->insert($menu);
        }
    }
}
