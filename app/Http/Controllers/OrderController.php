<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Order::with(['orderItems.product', 'user', 'customer', 'payments', 'shipments', 'bundles.bundle']);
        return DataTables::of($query)
            ->addColumn('order_number', fn($order) => $order->order_number)
            ->addColumn('status', fn($order) => $order->status)
            ->addColumn('actions', fn($order) => '')
            ->tojson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id'                         => 'required|integer|exists:customers,id',
            'ordered_at'                          => 'required|date',
            'order_number'                        => 'nullable|string|unique:orders,order_number',
            'notes'                               => 'nullable|string',
            'order_bundles'                       => 'nullable|array',
            'order_bundles.*.product_bundle_id'   => 'required|integer|exists:product_bundles,id',
            'order_bundles.*.height'              => 'required|integer|min:1',
            'order_bundles.*.poultry_house_count' => 'required|integer|min:1',
            'order_bundles.*.belt_width'          => 'required|integer|min:1',
            'order_bundles.*.lines_number'        => 'required|integer|min:1',
            'order_bundles.*.units_per_line'      => 'required|integer|min:1',
            'order_bundles.*.levels'              => 'required|integer|min:1',
            'order_items'                         => 'nullable|array',
            'order_items.*.product_id'            => 'required|integer|exists:products,id',
            'order_items.*.quantity'              => 'required|integer|min:1'
        ]);
        if ($request->isNotFilled('order_number')) {
            $orderNumber = strtoupper(uniqid('ORD-')) . '-' . now()->format('YmdHis');
            $request->merge(['order_number' => $orderNumber]);
        }
        $order = Order::create([
            'customer_id'  => $request->customer_id,
            'status'       => 'Pending',
            'order_number' => $request->input('order_number'),
            'notes'        => $request->input('notes') ?? '',
            'user_id'      => auth()->id(),
            'ordered_at'   => $request->input('ordered_at')
        ]);
        if ($request->has('order_bundles')) {
            foreach ($request->input('order_bundles') as $bundle) {
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
        if ($request->has('order_items')) {
            foreach ($request->input('order_items') as $item) {
                $order->orderItems()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity']
                ]);
            }
        }
        return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['orderItems.product', 'user', 'customer', 'payments', 'shipments'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'customer_id'                         => 'required|integer|exists:customers,id',
            'ordered_at'                          => 'required|date',
            'order_number'                        => 'required|string|unique:orders,order_number',
            'notes'                               => 'nullable|string',
            'order_bundles'                       => 'nullable|array',
            'order_bundles.*.product_bundle_id'   => 'required|integer|exists:product_bundles,id',
            'order_bundles.*.poultry_house_count' => 'required|integer|min:1',
            'order_bundles.*.height'              => 'required|integer|min:1',
            'order_bundles.*.belt_width'          => 'required|integer|min:1',
            'order_bundles.*.lines_number'        => 'required|integer|min:1',
            'order_bundles.*.units_per_line'      => 'required|integer|min:1',
            'order_bundles.*.levels'              => 'required|integer|min:1',
            'order_items'                         => 'nullable|array',
            'order_items.*.product_id'            => 'required|integer|exists:products,id',
            'order_items.*.quantity'              => 'required|integer|min:1'
        ]);
        $order = Order::with(['orderItems', 'bundles'])->findOrFail($id);
        $orderChanged = $order->customer_id != $request->customer_id ||
            $order->notes != $request->notes ||
            $order->ordered_at != $request->ordered_at ||
            $order->order_number != $request->order_number;
        if ($orderChanged) {
            $order->customer_id = $request->customer_id;
            $order->notes = $request->notes;
            $order->ordered_at = $request->ordered_at;
            $order->order_number = $request->order_number;
            $order->save();
        }
        $existingBundles = $order->bundles->map(function ($bundle) {
            return [
                'product_bundle_id'   => $bundle->product_bundle_id,
                'poultry_house_count' => $bundle->poultry_house_count,
                'height'              => $bundle->height,
                'belt_width'          => $bundle->belt_width,
                'lines_number'        => $bundle->lines_number,
                'units_per_line'      => $bundle->units_per_line,
                'levels'              => $bundle->levels,
            ];
        })->toArray();
        $newBundles = $request->order_bundles ?? [];
        if (empty($newBundles) && !empty($existingBundles)) {
            $order->bundles->each(function ($item) {
                $item->delete();
            });
        } elseif ($existingBundles !== $newBundles) {
            $order->bundles->each(function ($item) {
                $item->delete();
            });
            foreach ($newBundles as $bundle) {
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
        $existingItems = $order->orderItems->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity
            ];
        })->toArray();
        $newItems = $request->order_items ?? [];
        if (empty($newItems) && !empty($existingItems)) {
            $order->orderItems->each(function ($item) {
                $item->delete();
            });
        } elseif ($existingItems !== $newItems) {
            $order->orderItems->each(function ($item) {
                $item->delete();
            });
            foreach ($newItems as $item) {
                $order->orderItems()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity']
                ]);
            }
        }
        return response()->json([
            'message' => 'Order updated successfully',
            'order'   => $order->load('bundles', 'orderItems')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->bundles->each(function ($item) {
            $item->delete();
        });
        $order->orderItems->each(function ($item) {
            $item->delete();
        });
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully', 'order' => $order]);
    }
}
