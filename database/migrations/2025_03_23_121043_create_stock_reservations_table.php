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
        Schema::create('stock_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_id')->constrained('stock')->onDelete('cascade');
            $table->foreignId('uom_id')->constrained('uoms');
            $table->float('input_quantity');
            $table->float('quantity_in_base');
            $table->foreignId('order_id')->nullable();
            $table->enum('status', ['active', 'revoked'])->default('active');
            $table->text('revoked_reason')->nullable();
            $table->foreignId('reserved_by')->nullable();
            $table->timestamp('reserved_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    : void
    {
        Schema::dropIfExists('stock_reservations');
    }
};
