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
            'count',
            'weight',
            'volume',
            'length',
        ];
        $groupMap = [];
        foreach ($groups as $groupKey) {
            $groupMap[$groupKey] = UomGroup::create(['name' => $groupKey]);
        }
        $uoms = [
            // Count
            ['piece', 'pc', 'count', true, 1],
            ['box', 'box', 'count', false, 10],
            ['carton', 'ctn', 'count', false, 20],
            ['pallet', 'plt', 'count', false, 100],
            ['bag', 'bag', 'count', false, 5],
            // Weight
            ['kilogram', 'kg', 'weight', true, 1],
            ['gram', 'g', 'weight', false, 0.001],
            ['ton', 't', 'weight', false, 1000],
            ['pound', 'lb', 'weight', false, 0.4536],
            ['ounce', 'oz', 'weight', false, 0.0283],
            // Volume
            ['liter', 'L', 'volume', true, 1],
            ['milliliter', 'mL', 'volume', false, 0.001],
            ['gallon', 'gal', 'volume', false, 3.785],
            ['cubic_meter', 'm³', 'volume', false, 1000],
            // Length
            ['meter', 'm', 'length', true, 1],
            ['centimeter', 'cm', 'length', false, 0.01],
            ['millimeter', 'mm', 'length', false, 0.001],
            ['foot', 'ft', 'length', false, 0.3048],
            ['inch', 'in', 'length', false, 0.0254],
        ];
        $uomMap = [];
        foreach ($uoms as [$nameKey, $symbol, $groupKey, $isBase, $factor]) {
            $group = $groupMap[$groupKey];
            $uom = Uom::create([
                'name'              => $nameKey,
                'symbol'            => $symbol,
                'group_id'          => $group->id,
                'is_base'           => $isBase,
                'conversion_factor' => $factor,
            ]);
            $uomMap[strtolower($symbol)] = $uom;
        }
        $dimensions = [
            ['length', 'm'],
            ['thickness', 'mm'],
            ['width', 'cm'],
            ['volume', 'L'],
            ['weight', 'kg'],
        ];
        foreach ($dimensions as [$nameKey, $symbol]) {
            $key = strtolower($symbol);
            if (!isset($uomMap[$key])) {
                throw new \Exception("UOM with symbol '{$symbol}' not found for dimension '{$nameKey}'");
            }
            UomDimension::create([
                'name'   => $nameKey,
                'uom_id' => $uomMap[$key]->id,
            ]);
        }
    }
}
