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
        Schema::create('order_bundles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders', 'id')->onDelete('cascade');
            $table->foreignId('product_bundle_id')->constrained('product_bundles', 'id')->onDelete('cascade');
            $table->integer('height');
            $table->integer('belt_width');
            $table->integer('lines_number');
            $table->integer('units_per_line');
            $table->integer('levels');
            $table->integer('poultry_house_count');
            $table->integer('total_units');
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->float('progress')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    : void
    {
        Schema::dropIfExists('order_bundles');
    }
};
