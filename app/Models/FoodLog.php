<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodLog extends Model
{
    protected $table = 'diario_comidas';

    protected $fillable = [
        'user_id',
        'food_name',
        'brand',
        'calories',
        'proteins',
        'carbs',
        'fats',
        'quantity',
        'meal_type',
        'log_date',
    ];
}
