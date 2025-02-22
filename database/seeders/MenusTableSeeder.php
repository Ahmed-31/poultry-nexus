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
            ['title' => 'Dashboard', 'url' => '/dashboard', 'icon' => 'Home', 'parent_id' => null, 'order' => 1],
            ['title' => 'Factory Overview', 'url' => '/factory-overview', 'icon' => 'Factory', 'parent_id' => null, 'order' => 2],
            ['title' => 'Key Metrics & Analytics', 'url' => '/key-metrics', 'icon' => 'BarChart', 'parent_id' => null, 'order' => 3],

            ['title' => 'Inventory Management', 'url' => '/inventory', 'icon' => 'Box', 'parent_id' => null, 'order' => 4],
            ['title' => 'Raw Materials', 'url' => '/inventory/raw-materials', 'icon' => 'Package', 'parent_id' => 4, 'order' => 1],
            ['title' => 'Pre-Made Components', 'url' => '/inventory/pre-made-components', 'icon' => 'Cogs', 'parent_id' => 4, 'order' => 2],
            ['title' => 'Finished Products', 'url' => '/inventory/finished-products', 'icon' => 'CheckCircle', 'parent_id' => 4, 'order' => 3],
            ['title' => 'Stock Levels & Movements', 'url' => '/inventory/stock-levels', 'icon' => 'BarChart', 'parent_id' => 4, 'order' => 4],

            ['title' => 'Production & Processing', 'url' => '/production', 'icon' => 'Gears', 'parent_id' => null, 'order' => 5],
            ['title' => 'Production Orders', 'url' => '/production/orders', 'icon' => 'ClipboardList', 'parent_id' => 9, 'order' => 1],
            ['title' => 'Manufacturing Processes', 'url' => '/production/processes', 'icon' => 'Industry', 'parent_id' => 9, 'order' => 2],
            ['title' => 'Assembly Line Management', 'url' => '/production/assembly', 'icon' => 'ConveyorBelt', 'parent_id' => 9, 'order' => 3],
            ['title' => 'Machine Maintenance & Downtime Tracking', 'url' => '/production/machine-maintenance', 'icon' => 'Tools', 'parent_id' => 9, 'order' => 4],

            ['title' => 'Quality Control', 'url' => '/quality-control', 'icon' => 'ShieldCheck', 'parent_id' => null, 'order' => 6],
            ['title' => 'Inspection Reports', 'url' => '/quality-control/inspection-reports', 'icon' => 'ClipboardCheck', 'parent_id' => 14, 'order' => 1],
            ['title' => 'Compliance & Safety Tracking', 'url' => '/quality-control/compliance-safety', 'icon' => 'Shield', 'parent_id' => 14, 'order' => 2],

            ['title' => 'Order Processing', 'url' => '/orders', 'icon' => 'Cart', 'parent_id' => null, 'order' => 7],
            ['title' => 'Client Orders', 'url' => '/orders', 'icon' => 'UserCheck', 'parent_id' => 17, 'order' => 1],
            ['title' => 'Custom Manufacturing Requests', 'url' => '/orders/custom-requests', 'icon' => 'Wrench', 'parent_id' => 17, 'order' => 2],
            ['title' => 'Production Scheduling', 'url' => '/orders/scheduling', 'icon' => 'Calendar', 'parent_id' => 17, 'order' => 3],

            ['title' => 'Logistics & Supply Chain', 'url' => '/logistics', 'icon' => 'Truck', 'parent_id' => null, 'order' => 8],
            ['title' => 'Shipment Tracking', 'url' => '/logistics/shipment-tracking', 'icon' => 'MapPin', 'parent_id' => 21, 'order' => 1],
            ['title' => 'Fleet & Transportation Management', 'url' => '/logistics/fleet-management', 'icon' => 'Truck', 'parent_id' => 21, 'order' => 2],
            ['title' => 'Warehouse Management', 'url' => '/logistics/warehouse', 'icon' => 'Home', 'parent_id' => 21, 'order' => 3],

            ['title' => 'Procurement', 'url' => '/procurement', 'icon' => 'ShoppingBag', 'parent_id' => null, 'order' => 9],
            ['title' => 'Purchase Requests', 'url' => '/procurement/requests', 'icon' => 'ClipboardList', 'parent_id' => 25, 'order' => 1],
            ['title' => 'Vendor Management', 'url' => '/procurement/vendors', 'icon' => 'Users', 'parent_id' => 25, 'order' => 2],
            ['title' => 'Purchase Orders', 'url' => '/procurement/orders', 'icon' => 'FileText', 'parent_id' => 25, 'order' => 3],
        ];

        foreach ($menus as $menu) {
            DB::table('menus')->insert($menu);
        }
    }
}
