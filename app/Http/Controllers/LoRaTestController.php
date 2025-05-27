<?php

namespace App\Http\Controllers;

use App\Models\LoRaTest;
use Illuminate\Http\Request;

class LoRaTestController extends Controller
{

    public function store(Request $request)
    {
        $data = $request->validate([
            'message' => 'required|string|max:255',
        ]);
        LoRaTest::create($data);
        return response()->json(['message' => 'Data stored successfully'], 201);
    }
}
