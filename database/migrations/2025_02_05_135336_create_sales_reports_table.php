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
        Schema::create('sales_reports', function (Blueprint $table) {
            $table->id();
            $table->date('report_date');
            $table->decimal('total_sales', 15, 2);
            $table->integer('total_orders');
            $table->decimal('total_revenue', 15, 2);
            $table->decimal('total_expenses', 15, 2)->nullable();
            $table->decimal('net_profit', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_reports');
    }
};
