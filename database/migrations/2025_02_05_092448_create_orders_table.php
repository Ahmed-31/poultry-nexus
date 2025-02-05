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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade'); // Customer making the order
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // User handling the order (admin, sales rep, etc.)
            $table->string('order_number')->unique(); // Unique order number
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending'); // Order status
            $table->text('notes')->nullable(); // Additional order details
            $table->decimal('total_amount', 10, 2)->default(0.00); // Order total amount
            $table->timestamp('ordered_at')->nullable(); // Time when the order was placed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
