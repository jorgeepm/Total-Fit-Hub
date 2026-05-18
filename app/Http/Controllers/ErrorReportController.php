<?php

namespace App\Http\Controllers;

use App\Models\ErrorReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ErrorReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        ErrorReport::create([
            'user_id' => Auth::id(),
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Reporte de error enviado correctamente. ¡Gracias por tu ayuda!');
    }
}
