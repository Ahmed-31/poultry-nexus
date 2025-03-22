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
            ['title' => 'Inventory Dashboard', 'url' => '/inventory/dashboard', 'icon' => 'Package', 'parent_id' => 2, 'order' => 1],
            ['title' => 'Inventory List', 'url' => '/inventory/list', 'icon' => 'Cogs', 'parent_id' => 2, 'order' => 2],
            ['title' => 'Stock Levels & Movements', 'url' => '/inventory/stock-levels', 'icon' => 'BarChart', 'parent_id' => 2, 'order' => 3],
            ['title' => 'Warehouses', 'url' => '/inventory/warehouses', 'icon' => 'CheckCircle', 'parent_id' => 2, 'order' => 4],
            ['title' => 'Products', 'url' => '/inventory/products', 'icon' => 'Package', 'parent_id' => 2, 'order' => 5],

            ['title' => 'Production & Processing', 'url' => '/production', 'icon' => 'Gears', 'parent_id' => null, 'order' => 3],
            ['title' => 'Production Orders', 'url' => '/production/orders', 'icon' => 'ClipboardList', 'parent_id' => 8, 'order' => 1],
            ['title' => 'Manufacturing Processes', 'url' => '/production/processes', 'icon' => 'Industry', 'parent_id' => 8, 'order' => 2],
            ['title' => 'Assembly Line Management', 'url' => '/production/assembly', 'icon' => 'ConveyorBelt', 'parent_id' => 8, 'order' => 3],
            ['title' => 'Machine Maintenance & Downtime Tracking', 'url' => '/production/machine-maintenance', 'icon' => 'Tools', 'parent_id' => 8, 'order' => 4],

            ['title' => 'Quality Control', 'url' => '/quality-control', 'icon' => 'ShieldCheck', 'parent_id' => null, 'order' => 4],
            ['title' => 'Inspection Reports', 'url' => '/quality-control/inspection-reports', 'icon' => 'ClipboardCheck', 'parent_id' => 13, 'order' => 1],
            ['title' => 'Compliance & Safety Tracking', 'url' => '/quality-control/compliance-safety', 'icon' => 'Shield', 'parent_id' => 13, 'order' => 2],

            ['title' => 'Order Processing', 'url' => '/orders', 'icon' => 'Cart', 'parent_id' => null, 'order' => 5],
            ['title' => 'Client Orders', 'url' => '/orders', 'icon' => 'UserCheck', 'parent_id' => 16, 'order' => 1],
            ['title' => 'Custom Manufacturing Requests', 'url' => '/orders/custom-requests', 'icon' => 'Wrench', 'parent_id' => 16, 'order' => 2],
            ['title' => 'Production Scheduling', 'url' => '/orders/scheduling', 'icon' => 'Calendar', 'parent_id' => 16, 'order' => 3],

            ['title' => 'Logistics & Supply Chain', 'url' => '/logistics', 'icon' => 'Truck', 'parent_id' => null, 'order' => 6],
            ['title' => 'Shipment Tracking', 'url' => '/logistics/shipment-tracking', 'icon' => 'MapPin', 'parent_id' => 20, 'order' => 1],
            ['title' => 'Fleet & Transportation Management', 'url' => '/logistics/fleet-management', 'icon' => 'Truck', 'parent_id' => 20, 'order' => 2],
            ['title' => 'Warehouse Management', 'url' => '/logistics/warehouse', 'icon' => 'Home', 'parent_id' => 20, 'order' => 3],

            ['title' => 'Procurement', 'url' => '/procurement', 'icon' => 'ShoppingBag', 'parent_id' => null, 'order' => 7],
            ['title' => 'Purchase Requests', 'url' => '/procurement/requests', 'icon' => 'ClipboardList', 'parent_id' => 24, 'order' => 1],
            ['title' => 'Vendor Management', 'url' => '/procurement/vendors', 'icon' => 'Users', 'parent_id' => 24, 'order' => 2],
            ['title' => 'Purchase Orders', 'url' => '/procurement/orders', 'icon' => 'FileText', 'parent_id' => 24, 'order' => 3],

            ['title' => 'Sales & Distribution', 'url' => '/sales-distribution', 'icon' => 'DollarSign', 'parent_id' => null, 'order' => 8],
            ['title' => 'Sales Orders', 'url' => '/sales-distribution/orders', 'icon' => 'DollarSign', 'parent_id' => 28, 'order' => 1],
            ['title' => 'Customer Management', 'url' => '/sales-distribution/customers', 'icon' => 'Users', 'parent_id' => 28, 'order' => 2],
            ['title' => 'Contract & Pricing Management', 'url' => '/sales-distribution/pricing', 'icon' => 'FileSignature', 'parent_id' => 28, 'order' => 3],

            ['title' => 'Accounting & Finance', 'url' => '/accounting', 'icon' => 'Banknote', 'parent_id' => null, 'order' => 9],
            ['title' => 'Invoices & Payments', 'url' => '/accounting/invoices', 'icon' => 'Receipt', 'parent_id' => 32, 'order' => 1],
            ['title' => 'Expenses & Budgeting', 'url' => '/accounting/expenses', 'icon' => 'Wallet', 'parent_id' => 32, 'order' => 2],
            ['title' => 'Cost Analysis', 'url' => '/accounting/cost-analysis', 'icon' => 'BarChart2', 'parent_id' => 32, 'order' => 3],

            ['title' => 'HR & Payroll', 'url' => '/hr', 'icon' => 'UserCog', 'parent_id' => null, 'order' => 10],
            ['title' => 'Employee Management', 'url' => '/hr/employee-management', 'icon' => 'UserCog', 'parent_id' => 36, 'order' => 1],
            ['title' => 'Payroll Processing', 'url' => '/hr/payroll-processing', 'icon' => 'BadgeDollarSign', 'parent_id' => 36, 'order' => 2],
            ['title' => 'Workforce Scheduling', 'url' => '/hr/workforce-scheduling', 'icon' => 'CalendarCheck', 'parent_id' => 36, 'order' => 3],

            ['title' => 'Reports & Analytics', 'url' => '/reports', 'icon' => 'TrendingUp', 'parent_id' => null, 'order' => 11],
            ['title' => 'Production Performance', 'url' => '/reports/production-performance', 'icon' => 'TrendingUp', 'parent_id' => 40, 'order' => 1],
            ['title' => 'Inventory Turnover', 'url' => '/reports/inventory-turnover', 'icon' => 'RefreshCw', 'parent_id' => 40, 'order' => 2],
            ['title' => 'Sales & Revenue Reports', 'url' => '/reports/sales-revenue', 'icon' => 'BarChart2', 'parent_id' => 40, 'order' => 3],
            ['title' => 'Quality & Compliance Reports', 'url' => '/reports/quality-compliance', 'icon' => 'CheckCircle', 'parent_id' => 40, 'order' => 4],

            ['title' => 'Users Management', 'url' => '/', 'icon' => 'UsersCog', 'parent_id' => null, 'order' => 12],
            ['title' => 'Users List', 'url' => '/user-management/dashboard', 'icon' => 'LayoutDashboard', 'parent_id' => 45, 'order' => 1],
            ['title' => 'Roles & Permissions', 'url' => '/user-management/roles-permissions', 'icon' => 'ShieldCheck', 'parent_id' => 45, 'order' => 2],
        ];

        foreach ($menus as $menu) {
            DB::table('menus')->insert($menu);
        }
    }
}
