<?php

namespace App\Http\Controllers;

use App\Models\FoodLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Carbon\Carbon;

class NutritionController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());
        $logs = FoodLog::where('user_id', auth()->id())
            ->where('log_date', $date)
            ->get();

        $summary = [
            'calories' => $logs->sum('calories'),
            'proteins' => $logs->sum('proteins'),
            'carbs' => $logs->sum('carbs'),
            'fats' => $logs->sum('fats'),
        ];

        return Inertia::render('Nutrition/Index', [
            'logs' => $logs,
            'summary' => $summary,
            'selectedDate' => $date,
            'goals' => [
                'calories' => 2500, // Hardcoded for now or fetch from user profile
                'proteins' => 150,
                'carbs' => 300,
                'fats' => 70,
            ]
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        if (!$query) {
            return response()->json(['products' => []]);
        }

        $response = Http::get("https://es.openfoodfacts.org/cgi/search.pl", [
            'search_terms' => $query,
            'action' => 'process',
            'json' => 1,
            'page_size' => 24,
            'lc' => 'es',
            'cc' => 'es',
            'fields' => 'product_name,brands,nutriments,image_front_small_url,_id,quantity'
        ]);

        return $response->json();
    }

    public function store(Request $request)
    {
        if ($request->has('foods') && is_array($request->foods)) {
            foreach ($request->foods as $foodData) {
                $log = new FoodLog($foodData);
                $log->user_id = auth()->id();
                $log->save();
            }
            return redirect()->back()->with('success', 'Alimentos añadidos correctamente');
        }

        $validated = $request->validate([
            'food_name' => 'required|string',
            'brand' => 'nullable|string',
            'calories' => 'required|numeric',
            'proteins' => 'required|numeric',
            'carbs' => 'required|numeric',
            'fats' => 'required|numeric',
            'quantity' => 'required|numeric',
            'meal_type' => 'required|string',
            'log_date' => 'required|date',
        ]);

        $log = new FoodLog($validated);
        $log->user_id = auth()->id();
        $log->save();

        return redirect()->back()->with('success', 'Alimento añadido correctamente');
    }

    public function update(Request $request, $id)
    {
        $log = FoodLog::where('user_id', auth()->id())->findOrFail($id);
        
        $validated = $request->validate([
            'food_name' => 'required|string',
            'brand' => 'nullable|string',
            'calories' => 'required|numeric',
            'proteins' => 'required|numeric',
            'carbs' => 'required|numeric',
            'fats' => 'required|numeric',
            'quantity' => 'required|numeric',
            'meal_type' => 'required|string',
        ]);

        $log->update($validated);

        return redirect()->back()->with('success', 'Alimento actualizado');
    }

    public function destroy($id)
    {
        $log = FoodLog::where('user_id', auth()->id())->findOrFail($id);
        $log->delete();

        return redirect()->back()->with('success', 'Alimento eliminado');
    }
}
