<?php

namespace Database\Seeders;

use App\Models\User;

//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    : void
    {
        $users = [
            [
                'name'     => 'Admin User 1',
                'email'    => 'admin@example.com',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ],
            [
                'name'     => 'Sales Manager 1',
                'email'    => 'sales_manager@example.com',
                'password' => Hash::make('password'),
                'role'     => 'sales_manager',
            ],
            [
                'name'     => 'Sales Representative 1',
                'email'    => 'sales_representative@example.com',
                'password' => Hash::make('password'),
                'role'     => 'sales_representative',
            ],
            [
                'name'     => 'Procurement Manager 1',
                'email'    => 'procurement_manager@example.com',
                'password' => Hash::make('password'),
                'role'     => 'procurement_manager',
            ],
            [
                'name'     => 'Procurement Officer 1',
                'email'    => 'procurement_officer@example.com',
                'password' => Hash::make('password'),
                'role'     => 'procurement_officer',
            ],
            [
                'name'     => 'Inventory Manager 1',
                'email'    => 'inventory_manager@example.com',
                'password' => Hash::make('password'),
                'role'     => 'inventory_manager',
            ],
            [
                'name'     => 'Warehouse Staff 1',
                'email'    => 'warehouse_staff@example.com',
                'password' => Hash::make('password'),
                'role'     => 'warehouse_staff',
            ],
            [
                'name'     => 'Production Manager 1',
                'email'    => 'production_manager@example.com',
                'password' => Hash::make('password'),
                'role'     => 'production_manager',
            ],
            [
                'name'     => 'Production Staff 1',
                'email'    => 'production_staff@example.com',
                'password' => Hash::make('password'),
                'role'     => 'production_staff',
            ],
            [
                'name'     => 'Quality Control Inspector 1',
                'email'    => 'quality_control_inspector@example.com',
                'password' => Hash::make('password'),
                'role'     => 'quality_control_inspector',
            ],
            [
                'name'     => 'Logistics Manager 1',
                'email'    => 'logistics_manager@example.com',
                'password' => Hash::make('password'),
                'role'     => 'logistics_manager',
            ],
            [
                'name'     => 'Logistics Staff 1',
                'email'    => 'logistics_staff@example.com',
                'password' => Hash::make('password'),
                'role'     => 'logistics_staff',
            ],
            [
                'name'     => 'Customer Service Manager 1',
                'email'    => 'customer_service_manager@example.com',
                'password' => Hash::make('password'),
                'role'     => 'customer_service_manager',
            ],
            [
                'name'     => 'Customer Support Representative 1',
                'email'    => 'customer_support_representative@example.com',
                'password' => Hash::make('password'),
                'role'     => 'customer_support_representative',
            ],
            [
                'name'     => 'Reporting Analyst 1',
                'email'    => 'reporting_analyst@example.com',
                'password' => Hash::make('password'),
                'role'     => 'reporting_analyst',
            ],
        ];
        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name'     => $userData['name'],
                    'password' => $userData['password'],
                ]
            );
            $role = Role::where('name', $userData['role'])->first();
            if ($role) {
                $user->assignRole($role);
            }
        }
    }
}
