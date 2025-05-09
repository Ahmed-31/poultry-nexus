<?php

namespace Database\Seeders;

use App\Models\Uom;
use App\Models\UomDimension;
use App\Models\UomDimensionTranslation;
use App\Models\UomGroup;
use App\Models\UomGroupTranslation;
use App\Models\UomTranslation;
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
        DB::table('uom_translations')->truncate();
        DB::table('uom_dimension_translations')->truncate();
        DB::table('uom_group_translations')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $groups = [
            'count'       => ['en' => 'Count', 'ar' => 'عدد'],
            'weight'      => ['en' => 'Weight', 'ar' => 'وزن'],
            'volume'      => ['en' => 'Volume', 'ar' => 'حجم'],
            'length'      => ['en' => 'Length', 'ar' => 'طول'],
            'area'        => ['en' => 'Area', 'ar' => 'مساحة'],
            'time'        => ['en' => 'Time', 'ar' => 'وقت'],
            'temperature' => ['en' => 'Temperature', 'ar' => 'درجة حرارة'],
            'pressure'    => ['en' => 'Pressure', 'ar' => 'ضغط'],
        ];
        $groupMap = [];
        foreach ($groups as $groupKey => $translations) {
            $group = UomGroup::create(['name' => $groupKey]);
            $groupMap[$groupKey] = $group;
            foreach ($translations as $locale => $translatedName) {
                UomGroupTranslation::create([
                    'uom_group_id' => $group->id,
                    'locale'       => $locale,
                    'name'         => $translatedName,
                ]);
            }
        }
        $uoms = [
            // Count
            ['piece', 'pc', 'count', true, 1, ['en' => 'Piece', 'ar' => 'قطعة']],
            ['box', 'box', 'count', false, 10, ['en' => 'Box', 'ar' => 'علبة']],
            ['carton', 'ctn', 'count', false, 20, ['en' => 'Carton', 'ar' => 'كرتونة']],
            ['pallet', 'plt', 'count', false, 100, ['en' => 'Pallet', 'ar' => 'باليت']],
            ['bag', 'bag', 'count', false, 5, ['en' => 'Bag', 'ar' => 'كيس']],
            ['roll', 'roll', 'count', false, 1, ['en' => 'Roll', 'ar' => 'لفة']],
            // Weight
            ['kilogram', 'kg', 'weight', true, 1, ['en' => 'Kilogram', 'ar' => 'كيلوجرام']],
            ['gram', 'g', 'weight', false, 0.001, ['en' => 'Gram', 'ar' => 'جرام']],
            ['milligram', 'mg', 'weight', false, 0.000001, ['en' => 'Milligram', 'ar' => 'مليجرام']],
            ['ton', 't', 'weight', false, 1000, ['en' => 'Ton', 'ar' => 'طن']],
            ['pound', 'lb', 'weight', false, 0.4536, ['en' => 'Pound', 'ar' => 'رطل']],
            ['ounce', 'oz', 'weight', false, 0.0283, ['en' => 'Ounce', 'ar' => 'أونصة']],
            // Volume
            ['liter', 'L', 'volume', true, 1, ['en' => 'Liter', 'ar' => 'لتر']],
            ['milliliter', 'mL', 'volume', false, 0.001, ['en' => 'Milliliter', 'ar' => 'مليلتر']],
            ['gallon', 'gal', 'volume', false, 3.785, ['en' => 'Gallon', 'ar' => 'جالون']],
            ['cubic_meter', 'm³', 'volume', false, 1000, ['en' => 'Cubic Meter', 'ar' => 'متر مكعب']],
            ['barrel', 'bbl', 'volume', false, 159, ['en' => 'Barrel', 'ar' => 'برميل']],
            // Length
            ['meter', 'm', 'length', true, 1, ['en' => 'Meter', 'ar' => 'متر']],
            ['centimeter', 'cm', 'length', false, 0.01, ['en' => 'Centimeter', 'ar' => 'سنتيمتر']],
            ['millimeter', 'mm', 'length', false, 0.001, ['en' => 'Millimeter', 'ar' => 'مليمتر']],
            ['kilometer', 'km', 'length', false, 1000, ['en' => 'Kilometer', 'ar' => 'كيلومتر']],
            ['foot', 'ft', 'length', false, 0.3048, ['en' => 'Foot', 'ar' => 'قدم']],
            ['inch', 'in', 'length', false, 0.0254, ['en' => 'Inch', 'ar' => 'بوصة']],
            ['yard', 'yd', 'length', false, 0.9144, ['en' => 'Yard', 'ar' => 'ياردة']],
            // Area
            ['square_meter', 'm²', 'area', true, 1, ['en' => 'Square Meter', 'ar' => 'متر مربع']],
            ['hectare', 'ha', 'area', false, 10000, ['en' => 'Hectare', 'ar' => 'هكتار']],
            ['acre', 'ac', 'area', false, 4046.86, ['en' => 'Acre', 'ar' => 'فدان']],
            // Time
            ['second', 's', 'time', true, 1, ['en' => 'Second', 'ar' => 'ثانية']],
            ['minute', 'min', 'time', false, 60, ['en' => 'Minute', 'ar' => 'دقيقة']],
            ['hour', 'h', 'time', false, 3600, ['en' => 'Hour', 'ar' => 'ساعة']],
            ['day', 'd', 'time', false, 86400, ['en' => 'Day', 'ar' => 'يوم']],
            // Temperature
            ['celsius', '°C', 'temperature', true, 1, ['en' => 'Celsius', 'ar' => 'درجة مئوية']],
            ['fahrenheit', '°F', 'temperature', false, 0.5556, ['en' => 'Fahrenheit', 'ar' => 'فهرنهايت']],
            // Pressure
            ['pascal', 'Pa', 'pressure', true, 1, ['en' => 'Pascal', 'ar' => 'باسكال']],
            ['bar', 'bar', 'pressure', false, 100000, ['en' => 'Bar', 'ar' => 'بار']],
            ['atmosphere', 'atm', 'pressure', false, 101325, ['en' => 'Atmosphere', 'ar' => 'جو']]
        ];
        $uomMap = [];
        foreach ($uoms as [$nameKey, $symbol, $groupKey, $isBase, $factor, $translations]) {
            $group = $groupMap[$groupKey];
            $uom = Uom::create([
                'name'              => $nameKey,
                'symbol'            => $symbol,
                'group_id'          => $group->id,
                'is_base'           => $isBase,
                'conversion_factor' => $factor,
            ]);
            $uomMap[strtolower($symbol)] = $uom;
            foreach ($translations as $locale => $translatedName) {
                UomTranslation::create([
                    'uom_id' => $uom->id,
                    'locale' => $locale,
                    'name'   => $translatedName,
                ]);
            }
        }
        $dimensions = [
            ['length', 'm', ['en' => 'Length', 'ar' => 'الطول']],
            ['thickness', 'mm', ['en' => 'Thickness', 'ar' => 'السُمك']],
            ['width', 'cm', ['en' => 'Width', 'ar' => 'العرض']],
            ['height', 'm', ['en' => 'Height', 'ar' => 'الارتفاع']],
            ['diameter', 'mm', ['en' => 'Diameter', 'ar' => 'القطر']],
            ['volume', 'L', ['en' => 'Volume', 'ar' => 'الحجم']],
            ['weight', 'kg', ['en' => 'Weight', 'ar' => 'الوزن']],
            ['area', 'm²', ['en' => 'Area', 'ar' => 'المساحة']],
            ['pressure', 'Pa', ['en' => 'Pressure', 'ar' => 'الضغط']],
            ['temperature', '°C', ['en' => 'Temperature', 'ar' => 'درجة الحرارة']],
            ['time', 's', ['en' => 'Time', 'ar' => 'الزمن']]
        ];
        foreach ($dimensions as [$nameKey, $symbol, $translations]) {
            $key = strtolower($symbol);
            if (!isset($uomMap[$key])) {
                throw new \Exception("UOM with symbol '{$symbol}' not found for dimension '{$nameKey}'");
            }
            $dimension = UomDimension::create([
                'name'   => $nameKey,
                'uom_id' => $uomMap[$key]->id,
            ]);
            foreach ($translations as $locale => $translatedName) {
                UomDimensionTranslation::create([
                    'uom_dimension_id' => $dimension->id,
                    'locale'           => $locale,
                    'name'             => $translatedName,
                ]);
            }
        }
    }
}
