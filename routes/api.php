<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\OrderController;

Route::prefix('inventory')->group(function () {
    // Inventory Overview
    Route::get('/', [InventoryController::class, 'index']);
    Route::post('/', [InventoryController::class, 'store']);
});

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/bundles', [ProductController::class, 'bundles']);
});

Route::prefix('warehouses')->group(function () {
    Route::get('/', [WarehouseController::class, 'index']);
});

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
});

Route::prefix('customers')->group(function () {
    Route::get('/', [CustomerController::class, 'index']);
});

