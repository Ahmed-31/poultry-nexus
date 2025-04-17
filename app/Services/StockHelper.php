<?php

namespace App\Services;

use App\Models\Stock;
use App\Models\Uom;

class StockHelper
{
    public static function mergeStockWithNewUom(Stock $stock, float $inputQuantity, int $newUomId)
    : void
    {
        $newUom = Uom::findOrFail($newUomId);
        $incomingBaseQuantity = $inputQuantity * $newUom->conversion_factor;
        $totalBaseQuantity = ($stock->quantity_in_base ?? 0) + $incomingBaseQuantity;
        $convertedInputQuantity = $totalBaseQuantity / $newUom->conversion_factor;
        $stock->quantity_in_base = $totalBaseQuantity;
        $stock->input_quantity = $convertedInputQuantity;
        $stock->input_uom_id = $newUomId;
        $stock->save();
    }

    public static function reduceStockWithNewUom(Stock $stock, float $issuedQuantity, int $newUomId)
    : bool
    {
        $newUom = Uom::findOrFail($newUomId);
        $baseToDeduct = $issuedQuantity * $newUom->conversion_factor;
        if ($stock->quantity_in_base < $baseToDeduct) {
            return false;
        }
        $stock->quantity_in_base -= $baseToDeduct;
        if ($stock->quantity_in_base <= 0) {
            $stock->quantity_in_base = 0;
            $stock->input_quantity = 0;
            $stock->status = 'exhausted';
            $stock->save();
            return true;
        }
        $convertedInputQuantity = $stock->quantity_in_base / $newUom->conversion_factor;
        $stock->input_quantity = $convertedInputQuantity;
        $stock->input_uom_id = $newUomId;
        $stock->save();
        return true;
    }

    public static function addStockWithNewUom(Stock $stock, float $addedQuantity, int $newUomId)
    : void
    {
        $newUom = Uom::findOrFail($newUomId);
        $baseToAdd = $addedQuantity * $newUom->conversion_factor;
        $stock->quantity_in_base += $baseToAdd;
        $convertedInputQuantity = $stock->quantity_in_base / $newUom->conversion_factor;
        $stock->input_quantity = $convertedInputQuantity;
        $stock->input_uom_id = $newUomId;
        $stock->save();
    }
}
