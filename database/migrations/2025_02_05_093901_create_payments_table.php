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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade'); // Order Reference
            $table->enum('payment_method', ['cash', 'credit_card', 'bank_transfer', 'paypal']); // Payment type
            $table->decimal('amount', 10, 2); // Paid amount
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending'); // Payment Status
            $table->string('transaction_reference')->nullable(); // External Payment Reference (if any)
            $table->timestamp('paid_at')->nullable(); // Timestamp of successful payment
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
