<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\Uom;
use App\Services\StockHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class StockController extends Controller
{
    /**
     * Display a listing of stock items.
     */
    public function index()
    {
        $stock = Stock::with(['warehouse', 'product', 'dimensionValues.dimension.uom', 'inputUom'])->get();
        return response()->json($stock);
    }

    public function all()
    {
        $query = Stock::with(['warehouse', 'product', 'dimensionValues.dimension.uom', 'inputUom']);
        return DataTables::of($query)
            ->addColumn('id', fn($item) => $item->id)
            ->addColumn('amount', fn($item) => $item->input_quantity)
            ->addColumn('unit', fn($item) => optional($item->inputUom)->symbol ?? '-')
            ->addColumn('dimensions', function ($item) {
                if ($item->dimensionValues->isEmpty()) {
                    return '-';
                }
                return $item->dimensionValues
                    ->map(function ($dim) {
                        $value = $dim->value;
                        $symbol = $dim->dimension->uom->symbol ?? '';
                        return "{$value}{$symbol}";
                    })
                    ->implode(' x ');
            })
            ->addColumn('action', fn($item) => '')
            ->toJson();
    }

    /**
     * Store a newly created stock item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id'                => 'required|exists:products,id',
            'warehouse_id'              => 'required|exists:warehouses,id',
            'input_quantity'            => 'required|numeric|min:0',
            'input_uom_id'              => 'required|exists:uoms,id',
            'dimensions'                => 'required|array',
            'dimensions.*.dimension_id' => 'required|exists:uom_dimensions,id',
            'dimensions.*.value'        => 'required|numeric|min:0',
            'dimensions.*.uom_id'       => 'required|exists:uoms,id',
        ]);
        DB::transaction(function () use ($validated) {
            $uom = Uom::findOrFail($validated['input_uom_id']);
            $quantityInBase = $validated['input_quantity'] * $uom->conversion_factor;
            StockMovement::create([
                'product_id'    => $validated['product_id'],
                'warehouse_id'  => $validated['warehouse_id'],
                'quantity'      => $quantityInBase,
                'movement_type' => 'inbound',
                'reason'        => 'manual stock update',
                'created_by'    => auth()->id(),
            ]);
            $existingStocks = Stock::where('product_id', $validated['product_id'])
                ->where('warehouse_id', $validated['warehouse_id'])
                ->get();
            $matchedStock = null;
            foreach ($existingStocks as $stock) {
                $existingDims = $stock->dimensionValues->map(function ($d) {
                    return [
                        'dimension_id' => $d->dimension_id,
                        'value'        => (float)$d->value,
                        'uom_id'       => $d->uom_id,
                    ];
                })->sortBy('dimension_id')->values()->toArray();
                $incomingDims = collect($validated['dimensions'])->map(function ($d) {
                    return [
                        'dimension_id' => (int)$d['dimension_id'],
                        'value'        => (float)$d['value'],
                        'uom_id'       => (int)$d['uom_id'],
                    ];
                })->sortBy('dimension_id')->values()->toArray();
                if ($existingDims === $incomingDims) {
                    $matchedStock = $stock;
                    break;
                }
            }
            if ($matchedStock) {
                StockHelper::mergeStockWithNewUom($matchedStock, $validated['input_quantity'], $validated['input_uom_id']);
                $stock = $matchedStock;
            } else {
                $stock = Stock::create([
                    'product_id'       => $validated['product_id'],
                    'warehouse_id'     => $validated['warehouse_id'],
                    'input_quantity'   => $validated['input_quantity'],
                    'input_uom_id'     => $validated['input_uom_id'],
                    'quantity_in_base' => $quantityInBase,
                ]);
            }
            $stock->dimensionValues()->delete();
            foreach ($validated['dimensions'] as $dim) {
                $stock->dimensionValues()->create([
                    'dimension_id' => $dim['dimension_id'],
                    'value'        => $dim['value'],
                    'uom_id'       => $dim['uom_id'],
                ]);
            }
        });
        return response()->json(['message' => 'Stock added successfully'], Response::HTTP_CREATED);
    }

    /**
     * Display the specified stock item.
     */
    public function show(Stock $stock)
    {
        return response()->json($stock->load('product', 'warehouse'), Response::HTTP_OK);
    }

    /**
     * Update the specified stock item.
     */
    public function update(Request $request, Stock $stock)
    {
        $request->validate([
            'product_id'          => 'required|exists:products,id',
            'warehouse_id'        => 'required|exists:warehouses,id',
            'quantity'            => 'required|integer|min:0',
            'minimum_stock_level' => 'nullable|integer|min:0',
            'maximum_capacity'    => 'nullable|integer',
            'reserved_quantity'   => 'nullable|integer',
        ]);
        $stock->update($request->all());
        return response()->json($stock->load('product', 'warehouse'), Response::HTTP_OK);
    }

    /**
     * Remove the specified stock item.
     */
    public function destroy(Stock $stock)
    {
        $stock->dimensionValues()->delete();
        $stock->delete();
        return response()->json(['message' => 'Stock item deleted successfully'], Response::HTTP_NO_CONTENT);
    }

    public function updateManual(Request $request)
    {
        $validated = $request->validate([
            'product_id'   => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity'     => 'required|integer',
        ]);
        $stock = Stock::updateOrCreate(
            [
                'product_id'   => $validated['product_id'],
                'warehouse_id' => $validated['warehouse_id'],
            ],
            [
                'quantity' => $validated['quantity'],
            ]
        );
        return response()->json(['message' => 'Stock updated', 'data' => $stock]);
    }

    public function issue(Request $request, int $id)
    {
        $validated = $request->validate([
            'input_quantity'  => 'required|numeric|min:0.01',
            'input_uom_id'    => 'required|exists:uoms,id',
            'reason'          => 'required|string',
            'issued_to'       => 'nullable|string',
            'issue_reference' => 'nullable|string',
        ]);
        $stock = Stock::findOrFail($id);
        $uom = Uom::findOrFail($validated['input_uom_id']);
        $quantityInBase = $validated['input_quantity'] * $uom->conversion_factor;
        if ($stock->quantity_in_base < $quantityInBase) {
            return response()->json(['message' => 'Not enough stock to issue.'], 422);
        }
        DB::transaction(function () use ($stock, $validated, $uom, $quantityInBase) {
            $success = StockHelper::reduceStockWithNewUom(
                $stock,
                $validated['input_quantity'],
                $validated['input_uom_id']
            );
            if (!$success) {
                throw new \RuntimeException("Failed to reduce stock");
            }
            StockMovement::create([
                'product_id'    => $stock->product_id,
                'warehouse_id'  => $stock->warehouse_id,
                'quantity'      => $quantityInBase,
                'movement_type' => 'outbound',
                'reason'        => $validated['reason'],
                'movement_date' => now(),
                'created_by'    => auth()->id(),
            ]);
        });
        return response()->json(['message' => 'Stock issued successfully.']);
    }

    public function fetchMatchingStocks(Request $request)
    {
        $validated = $request->validate([
            'product_id'   => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
        ]);
        $stocks = Stock::with(['dimensionValues.dimension', 'inputUom'])
            ->where('product_id', $validated['product_id'])
            ->where('warehouse_id', $validated['warehouse_id'])
            ->get()
            ->map(function ($s) {
                return [
                    'id'             => $s->id,
                    'product_id'     => $s->product_id,
                    'warehouse_id'   => $s->warehouse_id,
                    'input_quantity' => $s->input_quantity,
                    'input_uom_id'   => $s->input_uom_id,
                    'uom'            => ['symbol' => $s->inputUom?->symbol],
                    'dimensions'     => $s->dimensionValues->map(fn($d) => [
                        'name'       => $d->dimension->name,
                        'value'      => $d->value,
                        'uom_symbol' => $d->uom?->symbol
                    ])
                ];
            });
        return response()->json($stocks);
    }

    public function transfer(Request $request, int $id)
    {
        $validated = $request->validate([
            'input_quantity'           => 'required|numeric|min:0.01',
            'input_uom_id'             => 'required|exists:uoms,id',
            'destination_warehouse_id' => 'required|exists:warehouses,id|different:warehouse_id',
            'reason'                   => 'required|string',
            'transfer_reference'       => 'nullable|string',
        ]);
        $stock = Stock::findOrFail($id);
        $uom = Uom::findOrFail($validated['input_uom_id']);
        $quantityInBase = $validated['input_quantity'] * $uom->conversion_factor;
        if ($stock->quantity_in_base < $quantityInBase) {
            return response()->json(['message' => 'Not enough quantity to transfer.'], 422);
        }
        DB::transaction(function () use ($stock, $validated, $uom, $quantityInBase) {
            $stock->quantity_in_base -= $quantityInBase;
            $stock->input_quantity -= $validated['input_quantity'];
            if ($stock->quantity_in_base <= 0) {
                $stock->dimensionValues()->delete();
                $stock->delete();
            } else {
                $stock->save();
            }
            $destination = Stock::firstOrNew([
                'product_id'   => $stock->product_id,
                'warehouse_id' => $validated['destination_warehouse_id'],
                'input_uom_id' => $validated['input_uom_id'],
            ]);
            $destination->quantity_in_base += $quantityInBase;
            $destination->input_quantity = ($destination->input_quantity ?? 0) + $validated['input_quantity'];
            $destination->save();
            StockMovement::create([
                'product_id'    => $stock->product_id,
                'warehouse_id'  => $stock->warehouse_id,
                'quantity'      => $quantityInBase,
                'movement_type' => 'outbound',
                'reason'        => $validated['reason'],
                'movement_date' => now(),
                'created_by'    => auth()->id(),
            ]);
            StockMovement::create([
                'product_id'    => $stock->product_id,
                'warehouse_id'  => $validated['destination_warehouse_id'],
                'quantity'      => $quantityInBase,
                'movement_type' => 'inbound',
                'reason'        => $validated['reason'],
                'movement_date' => now(),
                'created_by'    => auth()->id(),
            ]);
        });
        return response()->json(['message' => 'Stock transferred successfully.']);
    }

    public function adjust(Request $request, int $id)
    {
        $validated = $request->validate([
            'input_quantity'  => 'required|numeric|min:0.01',
            'input_uom_id'    => 'required|exists:uoms,id',
            'adjustment_type' => 'required|in:increase,decrease',
            'reason'          => 'nullable|string',
            'reference'       => 'nullable|string',
        ]);
        $stock = Stock::findOrFail($id);
        $uom = Uom::findOrFail($validated['input_uom_id']);
        $quantityInBase = $validated['input_quantity'] * $uom->conversion_factor;
        if ($validated['adjustment_type'] === 'decrease' && $quantityInBase > $stock->quantity_in_base) {
            return response()->json(['message' => 'Not enough stock to decrease.'], 422);
        }
        DB::transaction(function () use ($stock, $validated, $quantityInBase) {
            if ($validated['adjustment_type'] === 'increase') {
                $stock->quantity_in_base += $quantityInBase;
                $stock->input_quantity += $validated['input_quantity'];
            } else {
                $stock->quantity_in_base -= $quantityInBase;
                $stock->input_quantity -= $validated['input_quantity'];
            }
            if ($stock->quantity_in_base <= 0) {
                $stock->dimensionValues()->delete();
                $stock->delete();
            } else {
                $stock->save();
            }
            StockMovement::create([
                'product_id'    => $stock->product_id,
                'warehouse_id'  => $stock->warehouse_id,
                'quantity'      => $quantityInBase,
                'movement_type' => 'adjustment',
                'reason'        => $validated['reason'],
                'movement_date' => now(),
                'created_by'    => auth()->id(),
            ]);
        });
        if ($stock->exists) {
            return response()->json($stock->fresh()->load('product', 'warehouse'), 200);
        } else {
            return response()->json(['message' => 'Stock deleted after adjustment.'], 200);
        }
    }
}
