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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Product Name
            $table->text('description')->nullable(); // Product Description
            $table->decimal('price', 10, 2); // Product Price
            $table->integer('stock_quantity')->default(0); // Quantity in Stock
            $table->string('sku')->unique(); // Unique Stock Keeping Unit (SKU)
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null'); // Category Reference
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
