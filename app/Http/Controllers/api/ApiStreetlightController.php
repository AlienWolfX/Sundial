<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Readings;
use App\Models\Streetlight;
use Illuminate\Http\Request;

class ApiStreetlightController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Streetlight readings retrieved successfully.',
            'data' => Readings::all()
        ]);
    }

    /**
     * Display Summary
     */

    public function show_summary()
    {
        $streetlights = Streetlight::select('name', 'status', 'location')->get();
        $activeCount = $streetlights->where('status', 'Active')->count();
        $inactiveCount = $streetlights->where('status', 'Inactive')->count();
        $maintenanceCount = $streetlights->where('status', 'Maintenance')->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Streetlights Summary retrieved successfully.',
            'count' => $streetlights->count(),
            'active' => $activeCount,
            'inactive' => $inactiveCount,
            'maintenance' => $maintenanceCount,
        ]);
    }

    /**
     * Display Streetlights
     */

    public function show_streetlight() {
        $streetlights = Streetlight::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Streetlights retrieved successfully.',
            'data' => $streetlights
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $readings = Readings::where('streetlight_id', $id)->get();
        $streetlight = Streetlight::find($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Streetlight readings retrieved successfully.',
            'data' => $readings,
            'streetlight_status' => $streetlight ? $streetlight->status : null
        ]);
    }
}
