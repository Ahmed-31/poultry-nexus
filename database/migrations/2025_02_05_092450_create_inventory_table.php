<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); // Foreign Key to Products
            $table->foreignId('warehouse_id')->constrained()->onDelete('cascade'); // Foreign Key to Products
            $table->integer('quantity')->default(0);
            $table->integer('minimum_stock_level')->default(0);
            $table->integer('maximum_capacity')->nullable();
            $table->integer('reserved_quantity')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
