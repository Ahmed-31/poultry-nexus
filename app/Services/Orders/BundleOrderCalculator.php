<?php

namespace App\Services\Orders;

use App\Models\ProductBundle;

class BundleOrderCalculator
{
    public static function calculate(ProductBundle $bundle, array $parameterValues)
    {
        $results = [];
        $replacements = $parameterValues;
        $productNameMap = [];
        foreach ($bundle->formulas as $formula) {
            $product = $formula->product;
            if ($product) {
                $productNameMap['quantity_product_' . $product->id] = 0;
            }
        }
        foreach ($bundle->formulas as $formula) {
            $evaluatedFormula = $formula->formula;
            foreach ($replacements as $name => $value) {
                $evaluatedFormula = str_replace($name, $value, $evaluatedFormula);
            }
            foreach ($productNameMap as $quantityVar => $quantityValue) {
                $evaluatedFormula = str_replace($quantityVar, $quantityValue, $evaluatedFormula);
            }
            try {
                $calculatedQuantity = eval("return (float)($evaluatedFormula);");
            } catch (\Throwable $e) {
                throw new \Exception('Invalid formula structure for product ID ' . $formula->product_id . ': ' . $e->getMessage());
            }
            $calculatedQuantity = self::applyLimits($calculatedQuantity, $formula->min_quantity, $formula->max_quantity);
            $results[] = [
                'product_id'          => $formula->product_id,
                'calculated_quantity' => round($calculatedQuantity),
            ];
            $productNameMap['quantity_product_' . $formula->product_id] = round($calculatedQuantity);
        }
        return $results;
    }

    private static function applyLimits(float $quantity, $min = null, $max = null)
    : float
    {
        if (!is_null($min)) {
            $quantity = max($quantity, $min);
        }
        if (!is_null($max)) {
            $quantity = min($quantity, $max);
        }
        return $quantity;
    }
}
