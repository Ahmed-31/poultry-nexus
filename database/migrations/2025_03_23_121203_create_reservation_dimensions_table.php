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
        Schema::create('reservation_dimensions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('stock_reservations')->onDelete('cascade');
            $table->foreignId('dimension_id')->constrained('uom_dimensions');
            $table->float('value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_dimensions');
    }
};
