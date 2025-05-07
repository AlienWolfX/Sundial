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
            $table->integer('voltage_batt');
            $table->integer('current_batt');
            $table->integer('voltage_solar');
            $table->integer('current_solar');
            $table->integer('voltage_load');
            $table->integer('current_load');
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
