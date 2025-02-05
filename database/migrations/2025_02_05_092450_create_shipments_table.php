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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade'); // Links to orders
            $table->foreignId('supplier_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('tracking_number')->unique()->nullable(); // Optional tracking ID
            $table->string('carrier')->nullable(); // Shipping provider (e.g., DHL, FedEx)
            $table->string('status')->default('pending'); // Shipment status: pending, shipped, delivered
            $table->text('notes')->nullable(); // Additional shipment notes
            $table->dateTime('shipped_at')->nullable(); // When shipment was dispatched
            $table->dateTime('delivered_at')->nullable(); // When shipment was completed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
