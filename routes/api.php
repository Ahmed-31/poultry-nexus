<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProductBundleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\StockReservationController;
use App\Http\Controllers\UomController;
use App\Http\Controllers\UomDimensionController;
use App\Http\Controllers\UomGroupController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StockController;
use App\Http\Controllers\OrderController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::prefix('stock')->group(function () {
        Route::get('products/bundles/all', [ProductBundleController::class, 'all']);
        Route::get('products/all', [ProductController::class, 'all']);
        Route::get('warehouses/all', [WarehouseController::class, 'all']);
        Route::get('items/all', [StockController::class, 'all']);
        Route::get('items/fetch', [StockController::class, 'fetchMatchingStocks']);
        Route::post('items/{stock}/transfer', [StockController::class, 'transfer']);
        Route::post('items/{stock}/adjust', [StockController::class, 'adjust']);
        Route::post('items/{stock}/issue', [StockController::class, 'issue']);
        Route::get('stock-movements/all', [StockMovementController::class, 'all']);
        Route::post('update-manual', [StockController::class, 'updateManual']);
        Route::get('reservations', [StockReservationController::class, 'index']);
        Route::get('reservations/all', [StockReservationController::class, 'all']);
        Route::get('reservations/{id}', [StockReservationController::class, 'show']);
        Route::get('categories/all', [CategoryController::class, 'all']);
        Route::apiResource('products/bundles', ProductBundleController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('items', StockController::class);
        Route::apiResource('warehouses', WarehouseController::class);
        Route::apiResource('stock-movements', StockMovementController::class);
    });
    Route::get('orders/all', [OrderController::class, 'all']);
    Route::apiResource('orders', OrderController::class);
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index']);
    });
    Route::prefix('menus')->group(function () {
        Route::get('/', [MenuController::class, 'index']);
    });
    Route::prefix('settings')->group(function () {
        Route::get('uoms/all', [UomController::class, 'all']);
        Route::get('uom/dimensions/all', [UomDimensionController::class, 'all']);
        Route::get('uom/groups/all', [UomGroupController::class, 'all']);
        Route::apiResource('uoms', UomController::class);
        Route::apiResource('uom/dimensions', UomDimensionController::class);
        Route::apiResource('uom/groups', UomGroupController::class);
    });
});

