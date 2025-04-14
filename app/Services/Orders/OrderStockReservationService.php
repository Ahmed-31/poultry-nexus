<?php

namespace App\Services\Orders;

use App\Models\Order;
use App\Models\Stock;
use App\Models\StockReservation;
use App\Models\ProductBundleItem;
use Illuminate\Support\Facades\DB;

class OrderStockReservationService
{
    public function reserve(Order $order)
    : void
    {
        DB::transaction(function () use ($order) {
            if (is_array($order->order_items)) {
                $this->reserveOrderItems($order);
            }
            if (is_array($order->bundles)) {
                $this->reserveOrderBundles($order);
            }
        });
    }

    protected function reserveOrderItems(Order $order)
    : void
    {
        foreach ($order->order_items as $item) {
            $this->reserveProductStock(
                $item->product_id,
                $item->quantity,
                $order->id,
                $order->priority
            );
        }
    }

    protected function reserveOrderBundles(Order $order)
    : void
    {
        foreach ($order->bundles as $bundle) {
            $bundleItems = ProductBundleItem::where('product_bundle_id', $bundle->product_bundle_id)->get();
            $totalUnits = $bundle->total_units;
            $reservedCount = 0;
            $totalCount = count($bundleItems);
            foreach ($bundleItems as $component) {
                $requiredQty = $component->quantity * $totalUnits;
                $success = $this->reserveProductStock(
                    $component->product_id,
                    $requiredQty,
                    $order->id,
                    $order->priority,
                    $component->uom_id,
                    $component->dimension_values,
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
                'progress' => round(($reservedCount / $totalCount) * 100, 2),
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
        $stockQuery = Stock::where('product_id', $productId)
            ->where('quantity_in_base', '>', 0)
            ->orderBy('created_at');
        $stock = $stockQuery->first();
        if ($stock && $stock->quantity_in_base >= $requiredQty) {
            $this->createReservation($stock, $requiredQty, $uomId, $orderId, $dimensionValues, $source);
            $stock->decrement('quantity_in_base', $requiredQty);
            return true;
        }
        $revoked = $this->revokeLowerPriorityReservation($productId, $requiredQty, $orderPriority);
        if ($revoked) {
            $stock = $stockQuery->first();
            if ($stock && $stock->quantity_in_base >= $requiredQty) {
                $this->createReservation($stock, $requiredQty, $uomId, $orderId, $dimensionValues, $source);
                $stock->decrement('quantity_in_base', $requiredQty);
                return true;
            }
        }
        // TODO: Dispatch production or procurement request
        // dispatch(new HandleStockShortageJob($productId, $requiredQty, $orderId));
        return false;
    }

    protected function createReservation($stock, $qty, $uomId, $orderId, $dimensionValues, $source = null)
    : void
    {
        $reservation = StockReservation::create([
            'stock_id'         => $stock->id,
            'uom_id'           => $uomId ?? $stock->input_uom_id,
            'input_quantity'   => $qty,
            'quantity_in_base' => $qty,
            'order_id'         => $orderId,
            'reserved_by'      => auth()->id(),
        ]);
        if (!empty($dimensionValues)) {
            foreach ($dimensionValues as $dimId => $value) {
                $reservation->dimensions()->create([
                    'dimension_id' => $dimId,
                    'value'        => $value,
                ]);
            }
        }
        if ($source && method_exists($reservation, 'source')) {
            $reservation->source()->associate($source)->save();
        }
    }

    protected function revokeLowerPriorityReservation(int $productId, float $requiredQty, int $priority)
    : bool
    {
        $reservations = StockReservation::whereHas('stock', fn($q) => $q->where('product_id', $productId))
            ->where('status', 'active')
            ->whereHas('order', fn($q) => $q->where('priority', '<', $priority))
            ->orderBy('order.priority')
            ->get();
        $freedQty = 0;
        foreach ($reservations as $res) {
            $res->update([
                'status'         => 'revoked',
                'revoked_reason' => 'Overridden by higher priority order',
            ]);
            $res->stock->increment('quantity_in_base', $res->quantity_in_base);
            $freedQty += $res->quantity_in_base;
            if ($freedQty >= $requiredQty) break;
        }
        return $freedQty >= $requiredQty;
    }

    public function release(Order $order)
    : void
    {
        DB::transaction(function () use ($order) {
            $reservations = StockReservation::where('order_id', $order->id)
                ->where('status', 'active')
                ->get();
            foreach ($reservations as $reservation) {
                $reservation->stock->increment('quantity_in_base', $reservation->quantity_in_base);
                $reservation->update([
                    'status'         => 'released',
                    'revoked_reason' => 'Order deleted',
                ]);
            }
        });
    }
}
