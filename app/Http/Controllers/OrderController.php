<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Services\Orders\OrderStockReservationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\DataTables;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::withAllRelations()->get();
        return response()->json($orders);
    }

    public function all()
    {
        $query = Order::withAllRelations();
        return DataTables::of($query)
            ->addColumn('order_number', fn($order) => $order->order_number)
            ->addColumn('status', fn($order) => $order->status)
            ->addColumn('actions', fn($order) => '')
            ->tojson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        DB::beginTransaction();
        try {
            $order = Order::create([
                'customer_id'  => $request->customer_id,
                'status'       => 'pending',
                'order_number' => $request->input('order_number'),
                'notes'        => $request->notes ?? '',
                'priority'     => $request->input('priority'),
                'user_id'      => auth()->id(),
                'ordered_at'   => $request->ordered_at,
            ]);
            if (!empty($request->order_items) && is_array($request->order_items)) {
                $this->createOrderItems($order, $request->order_items);
            }
            if (!empty($request->order_bundles) && is_array($request->order_bundles)) {
                $this->createOrderBundles($order, $request->order_bundles);
            }
            $order->load(['orderItems.product', 'bundles.bundle.products', 'orderItems.dimensionValues']);
            (new OrderStockReservationService())->reserve($order);
            DB::commit();
            return response()->json([
                'message' => 'Order created and stock reserved successfully',
                'order'   => $order
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Order creation failed: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create order',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::withAllRelations()->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, string $id)
    {
        $order = Order::with(['orderItems', 'bundles'])->findOrFail($id);
        $order->update([
            'customer_id'  => $request->customer_id,
            'order_number' => $request->order_number,
            'notes'        => $request->notes ?? '',
            'ordered_at'   => $request->ordered_at,
        ]);
        $order->orderItems()->delete();
        if ($request->filled('order_items')) {
            $this->createOrderItems($order, $request->order_items);
        }
        $order->bundles()->delete();
        if ($request->filled('order_bundles')) {
            $this->createOrderBundles($order, $request->order_bundles);
        }
        try {
            $order->load(['orderItems.product', 'bundles.bundle.products']);
            (new OrderStockReservationService())->reserve($order);
        } catch (\Exception $e) {
            Log::error("Stock re-reservation failed for order {$order->id}: " . $e->getMessage());
            return response()->json([
                'message' => 'Order updated, but stock re-reservation failed',
                'order'   => $order,
                'error'   => $e->getMessage()
            ], 202);
        }
        return response()->json([
            'message' => 'Order updated successfully',
            'order'   => $order
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            $order = Order::with(['orderItems.dimensionValues', 'bundles'])->findOrFail($id);
            (new OrderStockReservationService())->release($order);
            $order->orderItems->each(function ($item) {
                $item->dimensionValues()->delete();
                $item->delete();
            });
            $order->bundles->each->delete();
            $order->delete();
            DB::commit();
            return response()->json([
                'message' => 'Order deleted and reservations released successfully.',
                'order'   => $order
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Order deletion failed for ID {$id}: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete order.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    private function createOrderItems(Order $order, array $items)
    : void
    {
        foreach ($items as $item) {
            $orderItem = $order->orderItems()->create([
                'product_id' => $item['product_id'],
                'quantity'   => $item['quantity'],
                'uom_id'     => $item['uom_id'],
            ]);
            if (!empty($item['dimensions']) && is_array($item['dimensions'])) {
                $dimensionValues = array_map(function ($dimension) use ($orderItem) {
                    return [
                        'dimension_id' => $dimension['dimension_id'],
                        'value'        => $dimension['value'],
                    ];
                }, $item['dimensions']);
                $orderItem->dimensionValues()->createMany($dimensionValues);
            }
        }
    }

    private function createOrderBundles(Order $order, array $bundles)
    : void
    {
        foreach ($bundles as $bundle) {
            $order->bundles()->create([
                'product_bundle_id'   => $bundle['product_bundle_id'],
                'poultry_house_count' => $bundle['poultry_house_count'],
                'height'              => $bundle['height'],
                'belt_width'          => $bundle['belt_width'],
                'lines_number'        => $bundle['lines_number'],
                'units_per_line'      => $bundle['units_per_line'],
                'levels'              => $bundle['levels'],
            ]);
        }
    }
}
