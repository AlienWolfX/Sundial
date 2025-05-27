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
            'streetlight_status' => $streetlight ? $streetlight->status : null,
            'streetlight_name' => $streetlight ? $streetlight->name : null
        ]);
    }

    public function update_status(Request $request, string $id)
    {
        $data = $request->validate([
            'status' => 'required|string|in:Active,Inactive,Maintenance',
        ]);

        $streetlight = Streetlight::find($id);
        if (!$streetlight) {
            return response()->json([
                'status' => 'error',
                'message' => 'Streetlight not found.',
            ], 404);
        }

        $streetlight->status = $data['status'];
        $streetlight->save();

        if ($data['status'] === 'Maintenance') {
            $scriptPath = base_path('../test/new.py');
            shell_exec("python3 " . escapeshellarg($scriptPath) . " maintenance");
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Streetlight status updated successfully.',
        ]);
    }
}
