<?php

namespace App\Services\Bundles;
class FormulaMapper
{
    protected static $operators = [
        'ضرب'  => '*',
        'قسمة' => '/',
        'زائد' => '+',
        'ناقص' => '-',
    ];

    public static function mapArabicToTechnical($arabicFormula, $parameters)
    {
        foreach (self::$operators as $arabic => $operator) {
            $arabicFormula = str_replace($arabic, $operator, $arabicFormula);
        }
        foreach ($parameters as $param) {
            $arabicName = $param->translations['ar'] ?? null;
            $technicalName = $param->name;
            if ($arabicName && $technicalName) {
                $arabicFormula = str_replace($arabicName, $technicalName, $arabicFormula);
            }
        }
        $fakeValues = [
            'battery_count'    => 1,
            'lines_count'      => 2,
            'total_columns'    => 3,
            'number_of_floors' => 4,
        ];
        $safeFormula = $arabicFormula;
        foreach ($fakeValues as $var => $value) {
            $safeFormula = str_replace($var, $value, $safeFormula);
        }
        try {
            eval('$test = ' . $safeFormula . ';');
        } catch (\Throwable $e) {
            throw new \Exception('Formula has invalid math structure.');
        }
        return $arabicFormula;
    }

    public static function buildFromBlocks(array $blocks, $parameters, $productNameMap = [])
    {
        $arabicParts = [];
        $technicalParts = [];
        foreach ($blocks as $block) {
            switch ($block['type']) {
                case 'parameter':
                    $param = collect($parameters)->firstWhere('name', $block['value']);
                    $arabicParts[] = $param ? ($param->translations['ar'] ?? $param->name) : $block['value'];
                    $technicalParts[] = $block['value'];
                    break;
                case 'product':
                    $productTechnicalName = $block['value'];
                    $productArabicName = array_search($productTechnicalName, $productNameMap) ?: $productTechnicalName;
                    $arabicParts[] = $productArabicName;
                    $technicalParts[] = $productTechnicalName;
                    break;
                case 'operator':
                case 'constant':
                    $arabicParts[] = $block['value'];
                    $technicalParts[] = $block['value'];
                    break;
            }
        }
        return [implode(' ', $arabicParts), implode(' ', $technicalParts)];
    }
}
