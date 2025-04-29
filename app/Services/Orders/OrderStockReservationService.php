<?php

namespace App\Services\Orders;

use App\Models\Order;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockReservation;
use App\Models\Uom;
use App\Services\StockHelper;
use Illuminate\Support\Facades\DB;

class OrderStockReservationService
{
    public function reserve(Order $order)
    : void
    {
        DB::transaction(function () use ($order) {
            $this->reserveOrderItems($order);
            $this->reserveOrderBundles($order);
        });
    }

    protected function reserveOrderItems(Order $order)
    : void
    {
        foreach ($order->orderItems as $item) {
            $this->reserveProductStock(
                $item->product_id,
                $item->quantity,
                $order->id,
                $order->priority,
                $item->uom_id,
                $item->dimensionValues->toArray()
            );
        }
    }

    protected function reserveOrderBundles(Order $order)
    : void
    {
        foreach ($order->bundles as $bundle) {
            $bundleItems = $bundle->items;
            $reservedCount = 0;
            $totalCount = $bundleItems->count();
            foreach ($bundleItems as $item) {
                $requiredQty = $item->calculated_quantity;
                $success = $this->reserveProductStock(
                    $item->product_id,
                    $requiredQty,
                    $order->id,
                    $order->priority,
                    $item->uom_id,
                    $item->dimension_values ?? [],
                    $bundle
                );
                if ($success) {
                    $reservedCount++;
                }
            }
            $bundle->update([
                'status'   => match (true) {
                    $reservedCount === 0           => 'not_started',
                    $reservedCount === $totalCount => 'completed',
                    default                        => 'in_progress'
                },
                'progress' => $totalCount > 0 ? round(($reservedCount / $totalCount) * 100, 2) : 0,
            ]);
        }
    }

    protected function reserveProductStock(
        int    $productId,
        float  $requiredQty,
        int    $orderId,
        int    $orderPriority,
        ?int   $uomId = null,
        ?array $dimensionValues = [],
               $source = null
    )
    : bool
    {
        $uomId ??= Product::find($productId)?->default_uom_id;
        $stockQuery = Stock::where('product_id', $productId)
            ->where('quantity_in_base', '>', 0)
            ->orderBy('created_at');
        if (!empty($dimensionValues)) {
            foreach ($dimensionValues as $dim) {
                $stockQuery->whereHas('dimensionValues', function ($q) use ($dim) {
                    $q->where('dimension_id', $dim['dimension_id'])
                        ->where('value', $dim['value']);
                });
            }
        } else {
            $stockQuery->whereDoesntHave('dimensionValues');
        }
        /** @var Stock|null $stock */
        $stock = $stockQuery->first();
        if ($stock) {
            $canReduce = StockHelper::reduceStockWithNewUom($stock, $requiredQty, $uomId);
            if ($canReduce) {
                $baseQty = $requiredQty * Uom::find($uomId)->conversion_factor;
                $this->createReservation($stock, $requiredQty, $baseQty, $uomId, $orderId, $dimensionValues, $source);
                return true;
            }
        }
        $revoked = $this->revokeLowerPriorityReservation($productId, $requiredQty * Uom::find($uomId)->conversion_factor, $orderPriority, $dimensionValues);
        if ($revoked) {
            $stock = $stockQuery->first();
            if ($stock) {
                $canReduce = StockHelper::reduceStockWithNewUom($stock, $requiredQty, $uomId);
                if ($canReduce) {
                    $baseQty = $requiredQty * Uom::find($uomId)->conversion_factor;
                    $this->createReservation($stock, $requiredQty, $baseQty, $uomId, $orderId, $dimensionValues, $source);
                    return true;
                }
            }
        }
        logger('could not reserve (no stock available)');
        // TODO: Dispatch production or procurement request
        return false;
    }

    protected function createReservation($stock, $inputQty, $baseQty, $uomId, $orderId, $dimensionValues, $source = null)
    : void
    {
        $reservation = StockReservation::create([
            'stock_id'         => $stock->id,
            'uom_id'           => $uomId ?? $stock->input_uom_id,
            'input_quantity'   => $inputQty,
            'quantity_in_base' => $baseQty,
            'order_id'         => $orderId,
            'reserved_by'      => auth()->id(),
        ]);
        if (!empty($dimensionValues)) {
            foreach ($dimensionValues as $dim) {
                $reservation->dimensions()->create([
                    'dimension_id' => $dim['dimension_id'],
                    'value'        => $dim['value'],
                ]);
            }
        }
        if ($source && method_exists($reservation, 'source')) {
            $reservation->source()->associate($source)->save();
        }
    }

    protected function revokeLowerPriorityReservation(
        int   $productId,
        float $requiredBaseQty,
        int   $priority,
        array $dimensionValues = []
    )
    : bool
    {
        $reservations = StockReservation::whereHas('stock', function ($q) use ($productId, $dimensionValues) {
            $q->where('product_id', $productId);
            foreach ($dimensionValues as $dim) {
                $dimId = $dim['dimension_id'];
                $value = $dim['value'];
                $q->whereHas('dimensionValues', function ($sub) use ($dimId, $value) {
                    $sub->where('dimension_id', $dimId)
                        ->where('value', $value);
                });
            }
        })
            ->where('status', 'active')
            ->whereHas('order', fn($q) => $q->where('priority', '<', $priority))
            ->with(['stock', 'order'])
            ->get()
            ->sortBy(fn($res) => $res->order->priority ?? 0)
            ->values();
        $freedQty = 0;
        foreach ($reservations as $res) {
            $neededQty = $requiredBaseQty - $freedQty;
            if ($res->quantity_in_base > $neededQty) {
                $revokeQty = $neededQty;
                $remainQty = $res->quantity_in_base - $revokeQty;
                $uom = Uom::findOrFail($res->uom_id);
                $revokeInputQty = $revokeQty / $uom->conversion_factor;
                $remainInputQty = $remainQty / $uom->conversion_factor;
                $res->update([
                    'quantity_in_base' => $remainQty,
                    'input_quantity'   => $remainInputQty,
                ]);
                $revoked = $res->replicate();
                $revoked->status = 'revoked';
                $revoked->revoked_reason = 'Partially overridden by higher priority order';
                $revoked->quantity_in_base = $revokeQty;
                $revoked->input_quantity = $revokeInputQty;
                $revoked->save();
                foreach ($res->dimensions as $dim) {
                    $revoked->dimensions()->create([
                        'dimension_id' => $dim->dimension_id,
                        'value'        => $dim->value,
                    ]);
                }
                StockHelper::addStockWithNewUom($res->stock, $revokeInputQty, $res->uom_id);
                $freedQty += $revokeQty;
                break;
            } else {
                $res->update([
                    'status'         => 'revoked',
                    'revoked_reason' => 'Overridden by higher priority order',
                ]);
                StockHelper::addStockWithNewUom(
                    $res->stock,
                    $res->input_quantity,
                    $res->uom_id
                );
                $freedQty += $res->quantity_in_base;
                if ($freedQty >= $requiredBaseQty) break;
            }
        }
        return $freedQty >= $requiredBaseQty;
    }

    public function release(Order $order)
    : void
    {
        DB::transaction(function () use ($order) {
            $reservations = StockReservation::where('order_id', $order->id)
                ->where('status', 'active')
                ->with('stock')
                ->get();
            foreach ($reservations as $reservation) {
                if ($reservation->stock) {
                    StockHelper::addStockWithNewUom(
                        $reservation->stock,
                        $reservation->input_quantity,
                        $reservation->uom_id
                    );
                }
                $reservation->update([
                    'status'         => 'released',
                    'revoked_reason' => 'Released due to order cancellation or deletion',
                ]);
            }
        });
    }
}
