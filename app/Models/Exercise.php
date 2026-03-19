<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'description', 'muscle_group', 'difficulty', 'instructions'])]

class Exercise extends Model
{
    public function routines()
    {
        return $this->belongsToMany(Routine::class)->withPivot('target_sets', 'target_reps')->withTimestamps();
    }
}

