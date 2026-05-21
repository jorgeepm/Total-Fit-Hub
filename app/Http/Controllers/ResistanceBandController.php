<?php

namespace App\Http\Controllers;

use App\Models\ResistanceBand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResistanceBandController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'color_nombre' => 'required|string|max:50',
            'peso_equivalente' => 'required|numeric|min:0|max:999'
        ]);

        ResistanceBand::create([
            'user_id' => Auth::id(),
            'color_nombre' => $validated['color_nombre'],
            'peso_equivalente' => $validated['peso_equivalente']
        ]);

        return back()->with('success', 'Banda elástica añadida.');
    }

    public function destroy($id)
    {
        $band = ResistanceBand::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $band->delete();

        return back()->with('success', 'Banda elástica eliminada.');
    }
}
