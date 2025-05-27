<?php

namespace App\Http\Controllers\api;

use App\Models\Readings;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ApiReadingsController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'streetlight_id' => 'required|integer',
            'voltage_batt' => 'required|numeric',
            'current_batt' => 'required|numeric',
            'voltage_solar' => 'required|numeric',
            'current_solar' => 'required|numeric',
            'voltage_load' => 'required|numeric',
            'current_load' => 'required|numeric',
        ]);

        $data['created_at'] = now();
        $data['updated_at'] = now();

        $reading = Readings::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Reading stored successfully.',
        ], 201);
    }
}
