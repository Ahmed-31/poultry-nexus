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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Customer's full name or business name
            $table->string('email')->unique()->nullable(); // Unique email (if available)
            $table->string('phone')->nullable(); // Contact number
            $table->string('address')->nullable(); // Customer address
            $table->enum('type', ['domestic', 'international'])->default('domestic'); // Customer type (domestic/import/export)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
