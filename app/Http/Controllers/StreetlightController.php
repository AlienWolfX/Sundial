<?php

namespace App\Http\Controllers;

use App\Models\Streetlight;
use Illuminate\Http\Request;

class StreetlightController extends Controller
{
    public function index()
    {
        $streetlights = Streetlight::all();
        return view('dashboard', compact('streetlights'));
    }

        public function create()
    {
        return view('streetlight.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'status' => 'required|string|in:Active,Inactive,Maintenance',
        ]);

        Streetlight::create($request->all());

        return redirect()->route('dashboard')->with('success', 'Streetlight added successfully.');
    }

    public function edit($id)
    {
        $streetlight = Streetlight::findOrFail($id);
        return view('streetlight.edit', compact('streetlight'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'status' => 'required|string|in:Active,Inactive,Maintenance',
        ]);

        $streetlight = Streetlight::findOrFail($id);
        $streetlight->update($request->all());

        return redirect()->route('dashboard')->with('success', 'Streetlight updated successfully.');
    }

    public function destroy($id)
    {
        $streetlight = Streetlight::findOrFail($id);
        $streetlight->delete();

        return redirect()->route('dashboard')->with('success', 'Streetlight deleted successfully.');
    }
}
