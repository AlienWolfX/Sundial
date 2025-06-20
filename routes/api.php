<?php

use App\Http\Controllers\api\ApiReadingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoRaTestController;
use App\Http\Controllers\api\ApiStreetlightController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('readings/summary', [ApiStreetlightController::class, 'show_summary']);
    Route::get('readings/streetlight/', [ApiStreetlightController::class, 'show_streetlight']);
    Route::put('status/{id}', [ApiStreetlightController::class, 'update_status']);
    Route::apiResource('readings', ApiStreetlightController::class);

    Route::post('readings/store', [ApiReadingsController::class, 'store']);
});

Route::prefix('test')->group(function () {
    Route::post('store', [LoRaTestController::class, 'store']);
});
