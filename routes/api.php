<?php

use App\Http\Controllers\AuthController;
use Spatie\Permission\Models\Permission;
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
use App\Http\Controllers\RoleController;

// Roles & Permissions Management (Accessible to All Authenticated Users)
Route::prefix('api')->middleware('auth:sanctum')->group(function () {
    // Roles Management
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']); // List all roles
        Route::post('/', [RoleController::class, 'store']); // Create a new role
        Route::put('/{id}', [RoleController::class, 'update']); // Update a role
        Route::delete('/{id}', [RoleController::class, 'destroy']); // Delete a role
    });

    // Permissions Management
    Route::get('/permissions', function () {
        return response()->json(Permission::all(['id', 'name']));
    });
});
Route::get('/test', function () {
    return response()->json(['status' => 'API is working']);
});


Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/users/all', [UserController::class, 'all']);
    Route::put('/user', [AuthController::class, 'update']);  // Add this line
    Route::apiResource('users', UserController::class);
    Route::get('/permissions', function () {
        return response()->json(Permission::pluck('name'));
    });
    
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

