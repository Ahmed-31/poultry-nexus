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
        Schema::create('stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('warehouse_id')->constrained()->onDelete('cascade');
            $table->float('quantity_in_base');
            $table->foreignId('input_uom_id')->nullable()->constrained('uoms');
            $table->float('input_quantity')->nullable();
            $table->enum('status', [
                'available',
                'reserved',
                'exhausted',
                'in_transit',
                'damaged',
                'quarantined',
                'archived',
            ])->default('available');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    : void
    {
        Schema::dropIfExists('stock');
    }
};
