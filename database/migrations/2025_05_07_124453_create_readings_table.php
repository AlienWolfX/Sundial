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
        Schema::create('readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('streetlight_id')->constrained()->onDelete('cascade');
            $table->float('voltage_batt', 8, 2);
            $table->float('current_batt', 8, 2);
            $table->float('voltage_solar', 8, 2);
            $table->float('current_solar', 8, 2);
            $table->float('voltage_load', 8, 2);
            $table->float('current_load', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('readings');
    }
};
