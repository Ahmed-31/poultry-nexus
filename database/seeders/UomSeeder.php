<?php

namespace Database\Seeders;

use App\Models\Uom;
use App\Models\UomDimension;
use App\Models\UomGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    : void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        UomDimension::truncate();
        Uom::truncate();
        UomGroup::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $groups = [
            'Count',
            'Weight',
            'Volume',
            'Length',
        ];
        $groupMap = [];
        foreach ($groups as $groupName) {
            $groupMap[$groupName] = UomGroup::create(['name' => $groupName]);
        }
        $uoms = [
            // Count
            ['Piece', 'pc', 'Count', true, 1],
            ['Box', 'box', 'Count', false, 10],
            ['Carton', 'ctn', 'Count', false, 20],
            ['Pallet', 'plt', 'Count', false, 100],
            ['Bag', 'bag', 'Count', false, 5],
            // Weight
            ['Kilogram', 'kg', 'Weight', true, 1],
            ['Gram', 'g', 'Weight', false, 0.001],
            ['Ton', 't', 'Weight', false, 1000],
            ['Pound', 'lb', 'Weight', false, 0.4536],
            ['Ounce', 'oz', 'Weight', false, 0.0283],
            // Volume
            ['Liter', 'L', 'Volume', true, 1],
            ['Milliliter', 'mL', 'Volume', false, 0.001],
            ['Gallon', 'gal', 'Volume', false, 3.785],
            ['Cubic Meter', 'm³', 'Volume', false, 1000],
            // Length
            ['Meter', 'm', 'Length', true, 1],
            ['Centimeter', 'cm', 'Length', false, 0.01],
            ['Millimeter', 'mm', 'Length', false, 0.001],
            ['Foot', 'ft', 'Length', false, 0.3048],
            ['Inch', 'in', 'Length', false, 0.0254],
        ];
        $uomMap = [];
        foreach ($uoms as [$name, $symbol, $groupName, $isBase, $factor]) {
            $group = $groupMap[$groupName];
            $uom = Uom::create([
                'name'              => $name,
                'symbol'            => $symbol,
                'group_id'          => $group->id,
                'is_base'           => $isBase,
                'conversion_factor' => $factor,
            ]);
            $uomMap[strtolower($symbol)] = $uom;
        }
        $dimensions = [
            ['Length', 'm'],
            ['Thickness', 'mm'],
            ['Width', 'cm'],
            ['Volume', 'L'],
            ['Weight', 'kg'],
        ];
        foreach ($dimensions as [$name, $symbol]) {
            $key = strtolower($symbol);
            if (!isset($uomMap[$key])) {
                throw new \Exception("UOM with symbol '{$symbol}' not found for dimension '{$name}'");
            }
            UomDimension::create([
                'name'   => $name,
                'uom_id' => $uomMap[$key]->id,
            ]);
        }
    }
}
