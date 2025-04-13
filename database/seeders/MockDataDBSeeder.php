<?php

namespace Database\Seeders;

use App\Models\Stock;
use App\Models\StockDimension;
use App\Models\Product;
use App\Models\StockReservation;
use App\Models\Uom;
use App\Models\UomDimension;
use App\Models\UomGroup;
use Carbon\Carbon;

//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MockDataDBSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    : void
    {
        $kg = Uom::where('symbol', 'kg')->first();
        $m = Uom::where('symbol', 'm')->first();
        $mm = Uom::where('symbol', 'mm')->first();
        $pcs = Uom::where('symbol', 'pc')->first();
        $countGroup = UomGroup::where('name', 'Count')->first();
        $weightGroup = UomGroup::where('name', 'Weight')->first();
        $lengthGroup = UomGroup::where('name', 'Length')->first();
        DB::table('users')->insert([
            [
                'name'              => 'Factory Admin',
                'email'             => 'admin@poultryfactory.com',
                'email_verified_at' => Carbon::now(),
                'password'          => Hash::make('admin123'),
                'remember_token'    => null,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
        ]);
        DB::table('categories')->insert([
            [
                'name'        => 'Feeding Systems',
                'description' => 'Automated feeding equipment for poultry.',
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'name'        => 'Drinking Systems',
                'description' => 'Efficient drinking solutions for poultry.',
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'name'        => 'Climate Control',
                'description' => 'Equipment for optimal poultry house climate.',
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
        ]);
        DB::table('products')->insert([
            [
                'name'           => 'Steel Sheet',
                'description'    => 'High-quality steel sheet for manufacturing.',
                'price'          => 120.50,
                'min_stock'      => 500,
                'sku'            => 'RM-STEEL-001',
                'type'           => 'raw_material',
                'uom_group_id'   => $countGroup->id,
                'default_uom_id' => $pcs->id,
                'category_id'    => 1,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Plastic Granules',
                'description'    => 'Raw plastic material used for molding.',
                'price'          => 75.00,
                'min_stock'      => 1000,
                'sku'            => 'RM-PLASTIC-002',
                'type'           => 'raw_material',
                'uom_group_id'   => $weightGroup->id,
                'default_uom_id' => $kg->id,
                'category_id'    => 1,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Aluminum Frame',
                'description'    => 'Pre-made aluminum frame for assembly.',
                'price'          => 250.75,
                'min_stock'      => 200,
                'sku'            => 'CMP-ALUFRAME-003',
                'type'           => 'component',
                'uom_group_id'   => $lengthGroup->id,
                'default_uom_id' => $m->id,
                'category_id'    => 2,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Motorized Fan',
                'description'    => 'High-speed motorized fan for cooling systems.',
                'price'          => 560.00,
                'min_stock'      => 150,
                'sku'            => 'CMP-FAN-004',
                'type'           => 'component',
                'uom_group_id'   => $countGroup->id,
                'default_uom_id' => $pcs->id,
                'category_id'    => 2,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Industrial Air Purifier',
                'description'    => 'Complete air purification unit.',
                'price'          => 3200.99,
                'min_stock'      => 50,
                'sku'            => 'FP-AIRPUR-005',
                'type'           => 'component',
                'uom_group_id'   => $countGroup->id,
                'default_uom_id' => $pcs->id,
                'category_id'    => 3,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Automated Conveyor Belt',
                'description'    => 'High-efficiency conveyor belt system.',
                'price'          => 7500.00,
                'min_stock'      => 20,
                'sku'            => 'FP-CONVEYOR-006',
                'type'           => 'consumable',
                'uom_group_id'   => $lengthGroup->id,
                'default_uom_id' => $m->id,
                'category_id'    => 3,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]
        ]);
        $steelSheet = Product::where('sku', 'RM-STEEL-001')->first();
        $lengthDim = UomDimension::where('name', 'Length')->first();
        $thicknessDim = UomDimension::where('name', 'Thickness')->first();
        $steelSheet->dimensions()->sync([
            $lengthDim->id,
            $thicknessDim->id
        ]);
        DB::table('suppliers')->insert([
            [
                'name'           => 'Poultry Equipment Co.',
                'contact_person' => 'John Doe',
                'email'          => 'contact@poultryequipco.com',
                'phone'          => '+1234567890',
                'address'        => '123 Poultry St, Farmville',
                'description'    => 'Leading supplier of poultry equipment.',
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ],
            [
                'name'           => 'AgriTech Supplies',
                'contact_person' => 'Jane Smith',
                'email'          => 'info@agritechsupplies.com',
                'phone'          => '+0987654321',
                'address'        => '456 Farm Road, AgriTown',
                'description'    => 'Supplier of agricultural technology products.',
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ],
            [
                'name'           => 'Farm Innovations Ltd.',
                'contact_person' => 'Mike Johnson',
                'email'          => 'sales@farminnovations.com',
                'phone'          => '+1122334455',
                'address'        => '789 Innovation Blvd, FarmCity',
                'description'    => 'Innovative solutions for modern farming.',
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ],
        ]);
        DB::table('customers')->insert([
            [
                'name'       => 'Green Poultry Farms',
                'email'      => 'contact@greenpoultryfarms.com',
                'phone'      => '+1223344556',
                'address'    => '101 Farm Lane, Countryside',
                'type'       => 'domestic',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name'       => 'Global Egg Distributors',
                'email'      => 'sales@globalegg.com',
                'phone'      => '+1987654321',
                'address'    => '202 Export Blvd, Port City',
                'type'       => 'international',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name'       => 'Fresh Farm Products',
                'email'      => 'info@freshfarm.com',
                'phone'      => '+1123456789',
                'address'    => '303 Agri Road, Ruralville',
                'type'       => 'domestic',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
        DB::table('orders')->insert([
            [
                'customer_id'  => DB::table('customers')->where('name', 'Green Poultry Farms')->first()->id,
                'user_id'      => DB::table('users')->where('email', 'admin@poultryfactory.com')->first()->id,
                'order_number' => 'ORD-1001',
                'status'       => 'pending',
                'notes'        => 'Urgent delivery requested.',
                'ordered_at'   => Carbon::now()->subDays(2),
                'created_at'   => Carbon::now(),
                'updated_at'   => Carbon::now(),
            ],
            [
                'customer_id'  => DB::table('customers')->where('name', 'Global Egg Distributors')->first()->id,
                'user_id'      => DB::table('users')->where('email', 'admin@poultryfactory.com')->first()->id,
                'order_number' => 'ORD-1002',
                'status'       => 'processing',
                'notes'        => 'Include detailed invoice.',
                'ordered_at'   => Carbon::now()->subDay(),
                'created_at'   => Carbon::now(),
                'updated_at'   => Carbon::now(),
            ],
            [
                'customer_id'  => DB::table('customers')->where('name', 'Fresh Farm Products')->first()->id,
                'user_id'      => DB::table('users')->where('email', 'admin@poultryfactory.com')->first()->id,
                'order_number' => 'ORD-1003',
                'status'       => 'shipped',
                'notes'        => 'Deliver to the back entrance.',
                'ordered_at'   => Carbon::now()->subDays(3),
                'created_at'   => Carbon::now(),
                'updated_at'   => Carbon::now(),
            ],
        ]);
        DB::table('order_items')->insert([
            [
                'order_id'    => DB::table('orders')->where('order_number', 'ORD-1001')->first()->id,
                'product_id'  => DB::table('products')->where('name', 'Motorized Fan')->first()->id,
                'quantity'    => 2,
                'total_price' => 1000.00,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'order_id'    => DB::table('orders')->where('order_number', 'ORD-1002')->first()->id,
                'product_id'  => DB::table('products')->where('name', 'Industrial Air Purifier')->first()->id,
                'quantity'    => 3,
                'total_price' => 450.00,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'order_id'    => DB::table('orders')->where('order_number', 'ORD-1003')->first()->id,
                'product_id'  => DB::table('products')->where('name', 'Automated Conveyor Belt')->first()->id,
                'quantity'    => 2,
                'total_price' => 600.00,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
        ]);
        DB::table('warehouses')->insert([
            [
                'name'        => 'Main Warehouse',
                'location'    => '123 Industrial Park, Farmville',
                'description' => 'Primary storage facility for all poultry equipment.',
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'name'        => 'Regional Distribution Center',
                'location'    => '456 Distribution Road, AgriTown',
                'description' => 'Facility for regional product distribution.',
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'name'        => 'Overflow Storage',
                'location'    => '789 Storage Lane, FarmCity',
                'description' => 'Used for excess stock and seasonal storage.',
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
        ]);
        DB::table('stock')->insert([
            [
                'product_id'       => 1,
                'warehouse_id'     => 1,
                'quantity_in_base' => 300,
                'input_uom_id'     => $pcs->id,
                'input_quantity'   => 300,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'product_id'       => 2,
                'warehouse_id'     => 1,
                'quantity_in_base' => 800,
                'input_uom_id'     => $kg->id,
                'input_quantity'   => 800,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'product_id'       => 3,
                'warehouse_id'     => 2,
                'quantity_in_base' => 150,
                'input_uom_id'     => $m->id,
                'input_quantity'   => 150,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'product_id'       => 4,
                'warehouse_id'     => 2,
                'quantity_in_base' => 120,
                'input_uom_id'     => $pcs->id,
                'input_quantity'   => 120,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'product_id'       => 5,
                'warehouse_id'     => 3,
                'quantity_in_base' => 40,
                'input_uom_id'     => $pcs->id,
                'input_quantity'   => 40,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'product_id'       => 6,
                'warehouse_id'     => 3,
                'quantity_in_base' => 15,
                'input_uom_id'     => $m->id,
                'input_quantity'   => 15,
                'created_at'       => now(),
                'updated_at'       => now(),
            ]
        ]);
        $stock = Stock::where('product_id', 1)->first();
        StockDimension::insert([
            [
                'stock_id'     => $stock->id,
                'dimension_id' => $lengthDim->id,
                'value'        => 2.5,
                'uom_id'       => $m->id,
            ],
            [
                'stock_id'     => $stock->id,
                'dimension_id' => $thicknessDim->id,
                'value'        => 0.6,
                'uom_id'       => $mm->id,
            ]
        ]);
        // 1. Steel Sheet - 20 pcs
        $res = StockReservation::create([
            'stock_id'         => $stock->id,
            'uom_id'           => $pcs->id,
            'input_quantity'   => 20,
            'quantity_in_base' => 20,
            'order_id'         => 1,
            'reserved_by'      => 1,
        ]);
        $res->dimensions()->createMany([
            ['dimension_id' => $lengthDim->id, 'value' => 2.5],
            ['dimension_id' => $thicknessDim->id, 'value' => 0.6],
        ]);
        // 2. Plastic Granules - 50 kg
        $res = StockReservation::create([
            'stock_id'         => Stock::where('product_id', 2)->first()->id,
            'uom_id'           => $kg->id,
            'input_quantity'   => 50,
            'quantity_in_base' => 50,
            'order_id'         => 1,
            'reserved_by'      => 1,
        ]);
        // 3. Aluminum Frame - 10 meters
        $res = StockReservation::create([
            'stock_id'         => Stock::where('product_id', 3)->first()->id,
            'uom_id'           => $m->id,
            'input_quantity'   => 10,
            'quantity_in_base' => 10,
            'order_id'         => 1,
            'reserved_by'      => 1,
        ]);
        // 4. Fan - 15 pcs
        $res = StockReservation::create([
            'stock_id'         => Stock::where('product_id', 4)->first()->id,
            'uom_id'           => $pcs->id,
            'input_quantity'   => 15,
            'quantity_in_base' => 15,
            'order_id'         => 1,
            'reserved_by'      => 1,
        ]);
        // 5. Air Purifier - 5 pcs
        $res = StockReservation::create([
            'stock_id'         => Stock::where('product_id', 5)->first()->id,
            'uom_id'           => $pcs->id,
            'input_quantity'   => 5,
            'quantity_in_base' => 5,
            'order_id'         => 1,
            'reserved_by'      => 1,
        ]);
        // 6. Conveyor Belt - 2 meters
        $res = StockReservation::create([
            'stock_id'         => Stock::where('product_id', 6)->first()->id,
            'uom_id'           => $m->id,
            'input_quantity'   => 2,
            'quantity_in_base' => 2,
            'order_id'         => 1,
            'reserved_by'      => 1,
        ]);
        DB::table('shipments')->insert([
            [
                'order_id'        => DB::table('orders')->where('order_number', 'ORD-1001')->first()->id,
                'supplier_id'     => DB::table('suppliers')->where('name', 'Poultry Equipment Co.')->first()->id,
                'customer_id'     => DB::table('customers')->where('name', 'Green Poultry Farms')->first()->id,
                'tracking_number' => 'TRACK-001',
                'carrier'         => 'DHL',
                'status'          => 'shipped',
                'notes'           => 'Handle with care.',
                'shipped_at'      => Carbon::now()->subDay(),
                'delivered_at'    => null,
                'created_at'      => Carbon::now(),
                'updated_at'      => Carbon::now(),
            ],
            [
                'order_id'        => DB::table('orders')->where('order_number', 'ORD-1002')->first()->id,
                'supplier_id'     => DB::table('suppliers')->where('name', 'AgriTech Supplies')->first()->id,
                'customer_id'     => DB::table('customers')->where('name', 'Global Egg Distributors')->first()->id,
                'tracking_number' => 'TRACK-002',
                'carrier'         => 'FedEx',
                'status'          => 'pending',
                'notes'           => 'Priority shipment.',
                'shipped_at'      => null,
                'delivered_at'    => null,
                'created_at'      => Carbon::now(),
                'updated_at'      => Carbon::now(),
            ],
            [
                'order_id'        => DB::table('orders')->where('order_number', 'ORD-1003')->first()->id,
                'supplier_id'     => DB::table('suppliers')->where('name', 'Farm Innovations Ltd.')->first()->id,
                'customer_id'     => DB::table('customers')->where('name', 'Fresh Farm Products')->first()->id,
                'tracking_number' => 'TRACK-003',
                'carrier'         => 'UPS',
                'status'          => 'delivered',
                'notes'           => 'Left at front porch.',
                'shipped_at'      => Carbon::now()->subDays(2),
                'delivered_at'    => Carbon::now()->subDay(),
                'created_at'      => Carbon::now(),
                'updated_at'      => Carbon::now(),
            ],
        ]);
        DB::table('payments')->insert([
            [
                'order_id'              => DB::table('orders')->where('order_number', 'ORD-1001')->first()->id,
                'payment_method'        => 'credit_card',
                'amount'                => 1150.00,
                'status'                => 'completed',
                'transaction_reference' => 'TRANS-1001',
                'paid_at'               => Carbon::now()->subDay(),
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
            [
                'order_id'              => DB::table('orders')->where('order_number', 'ORD-1002')->first()->id,
                'payment_method'        => 'bank_transfer',
                'amount'                => 1500.00,
                'status'                => 'pending',
                'transaction_reference' => 'TRANS-1002',
                'paid_at'               => null,
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
            [
                'order_id'              => DB::table('orders')->where('order_number', 'ORD-1003')->first()->id,
                'payment_method'        => 'paypal',
                'amount'                => 850.00,
                'status'                => 'completed',
                'transaction_reference' => 'TRANS-1003',
                'paid_at'               => Carbon::now()->subDays(2),
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
        ]);
        DB::table('supplier_products')->insert([
            [
                'supplier_id' => DB::table('suppliers')->where('name', 'Poultry Equipment Co.')->first()->id,
                'product_id'  => 1,
                'price'       => 450.00,
                'lead_time'   => 5,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'supplier_id' => DB::table('suppliers')->where('name', 'AgriTech Supplies')->first()->id,
                'product_id'  => 2,
                'price'       => 140.00,
                'lead_time'   => 7,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'supplier_id' => DB::table('suppliers')->where('name', 'Farm Innovations Ltd.')->first()->id,
                'product_id'  => 3,
                'price'       => 280.00,
                'lead_time'   => 10,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
        ]);
        DB::table('shipment_items')->insert([
            [
                'shipment_id'   => DB::table('shipments')->where('tracking_number', 'TRACK-001')->first()->id,
                'product_id'    => DB::table('products')->where('name', 'Motorized Fan')->first()->id,
                'order_item_id' => DB::table('order_items')->where('product_id', DB::table('products')->where('name', 'Motorized Fan')->first()->id)->first()->id,
                'stock_id'      => DB::table('stock')->where('product_id', DB::table('products')->where('name', 'Motorized Fan')->first()->id)->first()->id,
                'quantity'      => 2,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],
            [
                'shipment_id'   => DB::table('shipments')->where('tracking_number', 'TRACK-002')->first()->id,
                'product_id'    => DB::table('products')->where('name', 'Industrial Air Purifier')->first()->id,
                'order_item_id' => DB::table('order_items')->where('product_id', DB::table('products')->where('name', 'Industrial Air Purifier')->first()->id)->first()->id,
                'stock_id'      => DB::table('stock')->where('product_id', DB::table('products')->where('name', 'Industrial Air Purifier')->first()->id)->first()->id,
                'quantity'      => 3,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],
            [
                'shipment_id'   => DB::table('shipments')->where('tracking_number', 'TRACK-003')->first()->id,
                'product_id'    => DB::table('products')->where('name', 'Automated Conveyor Belt')->first()->id,
                'order_item_id' => DB::table('order_items')->where('product_id', DB::table('products')->where('name', 'Automated Conveyor Belt')->first()->id)->first()->id,
                'stock_id'      => DB::table('stock')->where('product_id', DB::table('products')->where('name', 'Automated Conveyor Belt')->first()->id)->first()->id,
                'quantity'      => 2,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],
        ]);
        DB::table('shipment_status_updates')->insert([
            [
                'shipment_id' => DB::table('shipments')->where('tracking_number', 'TRACK-001')->first()->id,
                'status'      => 'In Transit',
                'remarks'     => 'Shipment left the warehouse and is on the way.',
                'updated_at'  => Carbon::now()->subHours(5),
            ],
            [
                'shipment_id' => DB::table('shipments')->where('tracking_number', 'TRACK-002')->first()->id,
                'status'      => 'Pending',
                'remarks'     => 'Awaiting pickup from supplier.',
                'updated_at'  => Carbon::now()->subHours(10),
            ],
            [
                'shipment_id' => DB::table('shipments')->where('tracking_number', 'TRACK-003')->first()->id,
                'status'      => 'Delivered',
                'remarks'     => 'Shipment delivered to the customer.',
                'updated_at'  => Carbon::now()->subDay(),
            ],
        ]);
        DB::table('purchases')->insert([
            [
                'supplier_id'            => DB::table('suppliers')->where('name', 'Poultry Equipment Co.')->first()->id,
                'purchase_number'        => 'PUR-1001',
                'order_date'             => Carbon::now()->subDays(7),
                'expected_delivery_date' => Carbon::now()->addDays(3),
                'total_cost'             => 1350.00,
                'total_amount'           => 1500.00,
                'status'                 => 'pending',
                'notes'                  => 'Urgent requirement for feeding systems.',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
            [
                'supplier_id'            => DB::table('suppliers')->where('name', 'AgriTech Supplies')->first()->id,
                'purchase_number'        => 'PUR-1002',
                'order_date'             => Carbon::now()->subDays(10),
                'expected_delivery_date' => Carbon::now()->addDays(5),
                'total_cost'             => 1200.00,
                'total_amount'           => 1400.00,
                'status'                 => 'approved',
                'notes'                  => 'Approved for next batch of drinking systems.',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
            [
                'supplier_id'            => DB::table('suppliers')->where('name', 'Farm Innovations Ltd.')->first()->id,
                'purchase_number'        => 'PUR-1003',
                'order_date'             => Carbon::now()->subDays(14),
                'expected_delivery_date' => Carbon::now()->addDays(2),
                'total_cost'             => 900.00,
                'total_amount'           => 1000.00,
                'status'                 => 'received',
                'notes'                  => 'Received full order of ventilation fans.',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
        ]);
        DB::table('purchase_items')->insert([
            [
                'purchase_id' => DB::table('purchases')->where('purchase_number', 'PUR-1001')->first()->id,
                'product_id'  => DB::table('products')->where('name', 'Automated Conveyor Belt')->first()->id,
                'quantity'    => 10,
                'unit_price'  => 135.00,
                'total_price' => 1350.00,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'purchase_id' => DB::table('purchases')->where('purchase_number', 'PUR-1002')->first()->id,
                'product_id'  => DB::table('products')->where('name', 'Industrial Air Purifier')->first()->id,
                'quantity'    => 8,
                'unit_price'  => 150.00,
                'total_price' => 1200.00,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'purchase_id' => DB::table('purchases')->where('purchase_number', 'PUR-1003')->first()->id,
                'product_id'  => DB::table('products')->where('name', 'Motorized Fan')->first()->id,
                'quantity'    => 3,
                'unit_price'  => 300.00,
                'total_price' => 900.00,
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
        ]);
        DB::table('purchase_orders')->insert([
            [
                'supplier_id'            => DB::table('suppliers')->where('name', 'Poultry Equipment Co.')->first()->id,
                'order_number'           => 'PO-1001',
                'order_date'             => Carbon::now()->subDays(7),
                'expected_delivery_date' => Carbon::now()->addDays(3),
                'status'                 => 'pending',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
            [
                'supplier_id'            => DB::table('suppliers')->where('name', 'AgriTech Supplies')->first()->id,
                'order_number'           => 'PO-1002',
                'order_date'             => Carbon::now()->subDays(10),
                'expected_delivery_date' => Carbon::now()->addDays(5),
                'status'                 => 'received',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
            [
                'supplier_id'            => DB::table('suppliers')->where('name', 'Farm Innovations Ltd.')->first()->id,
                'order_number'           => 'PO-1003',
                'order_date'             => Carbon::now()->subDays(14),
                'expected_delivery_date' => Carbon::now()->addDays(2),
                'status'                 => 'canceled',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
        ]);
        DB::table('purchase_order_items')->insert([
            [
                'purchase_order_id' => DB::table('purchase_orders')->where('order_number', 'PO-1001')->first()->id,
                'product_id'        => DB::table('products')->where('name', 'Motorized Fan')->first()->id,
                'quantity'          => 15,
                'unit_price'        => 500.00,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            [
                'purchase_order_id' => DB::table('purchase_orders')->where('order_number', 'PO-1002')->first()->id,
                'product_id'        => DB::table('products')->where('name', 'Industrial Air Purifier')->first()->id,
                'quantity'          => 20,
                'unit_price'        => 150.00,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            [
                'purchase_order_id' => DB::table('purchase_orders')->where('order_number', 'PO-1003')->first()->id,
                'product_id'        => DB::table('products')->where('name', 'Automated Conveyor Belt')->first()->id,
                'quantity'          => 10,
                'unit_price'        => 300.00,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
        ]);
        DB::table('supplier_payments')->insert([
            [
                'supplier_id'           => DB::table('suppliers')->where('name', 'Poultry Equipment Co.')->first()->id,
                'purchase_order_id'     => DB::table('purchase_orders')->where('order_number', 'PO-1001')->first()->id,
                'amount'                => 7500.00,
                'payment_method'        => 'bank transfer',
                'transaction_reference' => 'BTX-1001',
                'payment_date'          => Carbon::now()->subDays(5),
                'status'                => 'completed',
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
            [
                'supplier_id'           => DB::table('suppliers')->where('name', 'AgriTech Supplies')->first()->id,
                'purchase_order_id'     => DB::table('purchase_orders')->where('order_number', 'PO-1002')->first()->id,
                'amount'                => 3000.00,
                'payment_method'        => 'credit card',
                'transaction_reference' => 'CCX-2002',
                'payment_date'          => Carbon::now()->subDays(3),
                'status'                => 'pending',
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
            [
                'supplier_id'           => DB::table('suppliers')->where('name', 'Farm Innovations Ltd.')->first()->id,
                'purchase_order_id'     => DB::table('purchase_orders')->where('order_number', 'PO-1003')->first()->id,
                'amount'                => 3000.00,
                'payment_method'        => 'cash',
                'transaction_reference' => null,
                'payment_date'          => Carbon::now()->subDays(7),
                'status'                => 'failed',
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
        ]);
        DB::table('customer_orders')->insert([
            [
                'customer_id'            => DB::table('customers')->where('name', 'Green Poultry Farms')->first()->id,
                'order_number'           => 'CO-1001',
                'order_date'             => Carbon::now()->subDays(3),
                'expected_delivery_date' => Carbon::now()->addDays(4),
                'status'                 => 'processing',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
            [
                'customer_id'            => DB::table('customers')->where('name', 'Global Egg Distributors')->first()->id,
                'order_number'           => 'CO-1002',
                'order_date'             => Carbon::now()->subDays(5),
                'expected_delivery_date' => Carbon::now()->addDays(6),
                'status'                 => 'shipped',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
            [
                'customer_id'            => DB::table('customers')->where('name', 'Fresh Farm Products')->first()->id,
                'order_number'           => 'CO-1003',
                'order_date'             => Carbon::now()->subDays(2),
                'expected_delivery_date' => Carbon::now()->addDays(3),
                'status'                 => 'pending',
                'created_at'             => Carbon::now(),
                'updated_at'             => Carbon::now(),
            ],
        ]);
        DB::table('customer_order_items')->insert([
            [
                'customer_order_id' => DB::table('customer_orders')->where('order_number', 'CO-1001')->first()->id,
                'product_id'        => DB::table('products')->where('name', 'Motorized Fan')->first()->id,
                'quantity'          => 5,
                'unit_price'        => 500.00,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            [
                'customer_order_id' => DB::table('customer_orders')->where('order_number', 'CO-1002')->first()->id,
                'product_id'        => DB::table('products')->where('name', 'Industrial Air Purifier')->first()->id,
                'quantity'          => 10,
                'unit_price'        => 150.00,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            [
                'customer_order_id' => DB::table('customer_orders')->where('order_number', 'CO-1003')->first()->id,
                'product_id'        => DB::table('products')->where('name', 'Automated Conveyor Belt')->first()->id,
                'quantity'          => 3,
                'unit_price'        => 300.00,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
        ]);
        DB::table('customer_payments')->insert([
            [
                'customer_id'           => DB::table('customers')->where('name', 'Green Poultry Farms')->first()->id,
                'customer_order_id'     => DB::table('customer_orders')->where('order_number', 'CO-1001')->first()->id,
                'amount'                => 2500.00,
                'payment_method'        => 'bank transfer',
                'transaction_reference' => 'BT-CO1001',
                'payment_date'          => Carbon::now()->subDays(2),
                'status'                => 'completed',
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
            [
                'customer_id'           => DB::table('customers')->where('name', 'Global Egg Distributors')->first()->id,
                'customer_order_id'     => DB::table('customer_orders')->where('order_number', 'CO-1002')->first()->id,
                'amount'                => 1500.00,
                'payment_method'        => 'credit card',
                'transaction_reference' => 'CC-CO1002',
                'payment_date'          => Carbon::now()->subDays(4),
                'status'                => 'pending',
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
            [
                'customer_id'           => DB::table('customers')->where('name', 'Fresh Farm Products')->first()->id,
                'customer_order_id'     => DB::table('customer_orders')->where('order_number', 'CO-1003')->first()->id,
                'amount'                => 900.00,
                'payment_method'        => 'cash',
                'transaction_reference' => null,
                'payment_date'          => Carbon::now()->subDays(1),
                'status'                => 'failed',
                'created_at'            => Carbon::now(),
                'updated_at'            => Carbon::now(),
            ],
        ]);
        DB::table('support_tickets')->insert([
            [
                'customer_id'       => DB::table('customers')->where('name', 'Green Poultry Farms')->first()->id,
                'customer_order_id' => DB::table('customer_orders')->where('order_number', 'CO-1001')->first()->id,
                'subject'           => 'Issue with Feed Dispenser',
                'message'           => 'The feed dispenser is not dispensing feed consistently.',
                'status'            => 'open',
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            [
                'customer_id'       => DB::table('customers')->where('name', 'Global Egg Distributors')->first()->id,
                'customer_order_id' => DB::table('customer_orders')->where('order_number', 'CO-1002')->first()->id,
                'subject'           => 'Delayed Shipment',
                'message'           => 'Our shipment has been delayed. Please provide an update.',
                'status'            => 'in_progress',
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            [
                'customer_id'       => DB::table('customers')->where('name', 'Fresh Farm Products')->first()->id,
                'customer_order_id' => DB::table('customer_orders')->where('order_number', 'CO-1003')->first()->id,
                'subject'           => 'Request for Invoice',
                'message'           => 'Please send us the invoice for our recent order.',
                'status'            => 'closed',
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
        ]);
        DB::table('sales_reports')->insert([
            [
                'report_date'    => Carbon::now()->subDays(7),
                'total_sales'    => 12000.00,
                'total_orders'   => 25,
                'total_revenue'  => 15000.00,
                'total_expenses' => 5000.00,
                'net_profit'     => 10000.00,
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ],
            [
                'report_date'    => Carbon::now()->subDays(14),
                'total_sales'    => 8000.00,
                'total_orders'   => 15,
                'total_revenue'  => 10000.00,
                'total_expenses' => 3000.00,
                'net_profit'     => 7000.00,
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ],
            [
                'report_date'    => Carbon::now()->subDays(21),
                'total_sales'    => 9500.00,
                'total_orders'   => 20,
                'total_revenue'  => 11000.00,
                'total_expenses' => 4000.00,
                'net_profit'     => 7000.00,
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ],
        ]);
        DB::table('stock_reports')->insert([
            [
                'report_date'        => Carbon::now()->subDays(7),
                'total_items'        => 150,
                'low_stock_items'    => 10,
                'out_of_stock_items' => 2,
                'total_stock_value'  => 35000.00,
                'created_at'         => Carbon::now(),
                'updated_at'         => Carbon::now(),
            ],
            [
                'report_date'        => Carbon::now()->subDays(14),
                'total_items'        => 170,
                'low_stock_items'    => 8,
                'out_of_stock_items' => 1,
                'total_stock_value'  => 40000.00,
                'created_at'         => Carbon::now(),
                'updated_at'         => Carbon::now(),
            ],
            [
                'report_date'        => Carbon::now()->subDays(21),
                'total_items'        => 140,
                'low_stock_items'    => 12,
                'out_of_stock_items' => 3,
                'total_stock_value'  => 30000.00,
                'created_at'         => Carbon::now(),
                'updated_at'         => Carbon::now(),
            ],
        ]);
        DB::table('product_bundles')->insert([
            [
                'name'        => 'Complete Poultry Feeding Kit',
                'description' => 'Includes Automatic Feed Dispenser and Nipple Drinker System.',
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'name'        => 'Poultry Climate & Feeding Solution',
                'description' => 'Combines Ventilation Fan and Automatic Feed Dispenser for optimal environment.',
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
        ]);
        DB::table('product_bundle_items')->insert([
            // Bundle 1: Complete Poultry Feeding Kit
            [
                'product_bundle_id' => 1,
                'product_id'        => 6,
                'uom_id'            => $m->id,
                'dimension_values'  => json_encode(['length' => 100, 'width' => 50, 'height' => 30]),
                'quantity'          => 1,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            [
                'product_bundle_id' => 1,
                'product_id'        => 5,
                'uom_id'            => $pcs->id,
                'dimension_values'  => json_encode(['length' => 80, 'width' => 40, 'height' => 20]),
                'quantity'          => 2,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            // Bundle 2: Poultry Climate & Feeding Solution
            [
                'product_bundle_id' => 2,
                'product_id'        => 3,
                'uom_id'            => $m->id,
                'dimension_values'  => json_encode(['length' => 60, 'width' => 30, 'height' => 15]),
                'quantity'          => 1,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
            [
                'product_bundle_id' => 2,
                'product_id'        => 4,
                'uom_id'            => $pcs->id,
                'dimension_values'  => json_encode(['length' => 70, 'width' => 35, 'height' => 18]),
                'quantity'          => 1,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ],
        ]);
        DB::table('order_bundles')->insert([
            [
                'order_id'            => DB::table('orders')->where('order_number', 'ORD-1001')->first()->id,
                'product_bundle_id'   => DB::table('product_bundles')->where('name', 'Complete Poultry Feeding Kit')->first()->id,
                'height'              => 200,
                'belt_width'          => 146,
                'lines_number'        => 3,
                'units_per_line'      => 50,
                'levels'              => 3,
                'total_units'         => 150,
                'poultry_house_count' => 4,
                'created_at'          => Carbon::now(),
                'updated_at'          => Carbon::now(),
            ],
            [
                'order_id'            => DB::table('orders')->where('order_number', 'ORD-1002')->first()->id,
                'product_bundle_id'   => DB::table('product_bundles')->where('name', 'Poultry Climate & Feeding Solution')->first()->id,
                'height'              => 190,
                'belt_width'          => 144,
                'lines_number'        => 4,
                'units_per_line'      => 40,
                'levels'              => 4,
                'total_units'         => 160,
                'poultry_house_count' => 2,
                'created_at'          => Carbon::now(),
                'updated_at'          => Carbon::now(),
            ],
        ]);
        DB::table('stock_movements')->insert([
            [
                'product_id'    => 1,
                'warehouse_id'  => 1,
                'quantity'      => 100,
                'movement_type' => 'inbound',
                'reason'        => 'New stock received from supplier',
                'movement_date' => now(),
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'product_id'    => 2,
                'warehouse_id'  => 1,
                'quantity'      => -50,
                'movement_type' => 'outbound',
                'reason'        => 'Shipped to manufacturing unit',
                'movement_date' => now(),
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'product_id'    => 3,
                'warehouse_id'  => 2,
                'quantity'      => 80,
                'movement_type' => 'inbound',
                'reason'        => 'Restocked after shortage',
                'movement_date' => now(),
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'product_id'    => 4,
                'warehouse_id'  => 2,
                'quantity'      => -30,
                'movement_type' => 'outbound',
                'reason'        => 'Order fulfillment for client',
                'movement_date' => now(),
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'product_id'    => 5,
                'warehouse_id'  => 3,
                'quantity'      => 10,
                'movement_type' => 'adjustment',
                'reason'        => 'Stock count correction',
                'movement_date' => now(),
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'product_id'    => 6,
                'warehouse_id'  => 3,
                'quantity'      => -5,
                'movement_type' => 'outbound',
                'reason'        => 'Sample sent for testing',
                'movement_date' => now(),
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);
    }
}
