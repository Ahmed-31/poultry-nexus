<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\OrderController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/users/all', [UserController::class, 'all']);
    Route::apiResource('users', UserController::class);
    Route::prefix('inventory')->group(function () {
        Route::get('products/bundles', [ProductController::class, 'bundles']);
        Route::get('products/all', [ProductController::class, 'all']);
        Route::get('warehouses/all', [WarehouseController::class, 'all']);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('items', InventoryController::class);
        Route::apiResource('warehouses', WarehouseController::class);
        Route::apiResource('stock-movements', StockMovementController::class);
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
    Route::prefix('menus')->group(function () {
        Route::get('/', [MenuController::class, 'index']);
    });
});

