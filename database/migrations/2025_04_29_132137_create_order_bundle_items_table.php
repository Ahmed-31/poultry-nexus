<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    : void
    {
        Schema::create('order_bundle_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_bundle_id')->constrained('order_bundles')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->json('dimension_values')->nullable();
            $table->integer('calculated_quantity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    : void
    {
        Schema::dropIfExists('order_bundle_items');
    }
};
