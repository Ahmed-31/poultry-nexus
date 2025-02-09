<?php

namespace Database\Seeders;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    : void
    {
        // Clear cache
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        // Define permissions
        $permissions = [
            'manage_users',
            'create_order',
            'edit_order',
            'delete_order',
            'view_order',
            'generate_quotation',
            'approve_quotation',
            'reject_quotation',
            'delete_quotation',
            'view_quotation',
            'confirm_order',
            'generate_invoice',
            'assign_order_number',
            'view_invoice',
            'check_raw_material_availability',
            'trigger_procurement',
            'create_purchase_order',
            'edit_purchase_order',
            'approve_purchase_order',
            'manage_supplier_interactions',
            'track_purchase_order',
            'receive_materials',
            'perform_quality_check',
            'update_stock',
            'allocate_materials_to_production',
            'update_inventory_levels',
            'generate_inventory_report',
            'schedule_production',
            'assign_production_tasks',
            'create_work_order',
            'edit_work_order',
            'view_work_order',
            'track_manufacturing_progress',
            'execute_assigned_tasks',
            'record_production_issues',
            'inspect_finished_products',
            'generate_qc_report',
            'approve_for_packaging',
            'pack_equipment',
            'label_products',
            'plan_transportation',
            'generate_shipping_documents',
            'oversee_dispatch_operations',
            'update_dispatch_status',
            'share_tracking_details',
            'confirm_delivery',
            'obtain_proof_of_delivery',
            'handle_warranty_claims',
            'handle_service_requests',
            'schedule_maintenance',
            'manage_service_requests',
            'request_customer_feedback',
            'view_feedback_reports',
            'generate_sales_report',
            'view_sales_report',
            'generate_production_efficiency_report',
            'view_production_report',
            'generate_inventory_report',
            'view_inventory_report',
            'create_custom_report',
            'export_report',
        ];
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        // Define roles and assign existing permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $salesManager = Role::firstOrCreate(['name' => 'sales_manager']);
        $salesRepresentative = Role::firstOrCreate(['name' => 'sales_representative']);
        $procurementManager = Role::firstOrCreate(['name' => 'procurement_manager']);
        $procurementOfficer = Role::firstOrCreate(['name' => 'procurement_officer']);
        $inventoryManager = Role::firstOrCreate(['name' => 'inventory_manager']);
        $warehouseStaff = Role::firstOrCreate(['name' => 'warehouse_staff']);
        $productionManager = Role::firstOrCreate(['name' => 'production_manager']);
        $productionStaff = Role::firstOrCreate(['name' => 'production_staff']);
        $qualityControlInspector = Role::firstOrCreate(['name' => 'quality_control_inspector']);
        $logisticsManager = Role::firstOrCreate(['name' => 'logistics_manager']);
        $logisticsStaff = Role::firstOrCreate(['name' => 'logistics_staff']);
        $customerServiceManager = Role::firstOrCreate(['name' => 'customer_service_manager']);
        $customerSupportRepresentative = Role::firstOrCreate(['name' => 'customer_support_representative']);
        $reportingAnalyst = Role::firstOrCreate(['name' => 'reporting_analyst']);
        // Assign permissions to roles
        $adminRole->givePermissionTo(Permission::all());
        $salesManager->givePermissionTo([
            'create_order',
            'edit_order',
            'view_order',
            'generate_quotation',
            'approve_quotation',
            'confirm_order',
            'generate_invoice',
            'view_sales_report',
        ]);
        $salesRepresentative->givePermissionTo([
            'create_order',
            'view_order',
            'generate_quotation',
            'view_quotation',
        ]);
        $procurementManager->givePermissionTo([
            'approve_purchase_order',
            'track_purchase_order',
            'manage_supplier_interactions',
            'generate_inventory_report',
        ]);
        $procurementOfficer->givePermissionTo([
            'create_purchase_order',
            'edit_purchase_order',
            'track_purchase_order',
            'check_raw_material_availability',
            'trigger_procurement',
        ]);
        $inventoryManager->givePermissionTo([
            'allocate_materials_to_production',
            'update_inventory_levels',
            'generate_inventory_report',
        ]);
        $warehouseStaff->givePermissionTo([
            'receive_materials',
            'perform_quality_check',
            'update_stock',
        ]);
        $productionManager->givePermissionTo([
            'schedule_production',
            'assign_production_tasks',
            'create_work_order',
            'edit_work_order',
            'track_manufacturing_progress',
            'generate_production_efficiency_report',
            'view_production_report',
        ]);
        $productionStaff->givePermissionTo([
            'execute_assigned_tasks',
            'record_production_issues',
        ]);
        $qualityControlInspector->givePermissionTo([
            'inspect_finished_products',
            'generate_qc_report',
            'approve_for_packaging',
        ]);
        $logisticsManager->givePermissionTo([
            'plan_transportation',
            'generate_shipping_documents',
            'oversee_dispatch_operations',
        ]);
        $logisticsStaff->givePermissionTo([
            'pack_equipment',
            'label_products',
            'update_dispatch_status',
            'share_tracking_details',
        ]);
        $customerServiceManager->givePermissionTo([
            'handle_warranty_claims',
            'manage_service_requests',
            'request_customer_feedback',
            'view_feedback_reports',
        ]);
        $customerSupportRepresentative->givePermissionTo([
            'handle_service_requests',
            'schedule_maintenance',
            'confirm_delivery',
            'obtain_proof_of_delivery',
        ]);
        $reportingAnalyst->givePermissionTo([
            'generate_sales_report',
            'generate_production_efficiency_report',
            'generate_inventory_report',
            'create_custom_report',
            'export_report',
        ]);
    }
}
