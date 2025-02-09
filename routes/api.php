<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryController;

Route::prefix('inventory')->group(function () {
    // Inventory Overview
    Route::get('/', [InventoryController::class, 'index']);
    Route::post('/', [InventoryController::class, 'store']);
});

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
});

Route::prefix('warehouses')->group(function () {
    Route::get('/', [WarehouseController::class, 'index']);
});

