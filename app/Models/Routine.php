<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'name', 'description'])]

class Routine extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exercises()
    {
        return $this->belongsToMany(Exercise::class)->withPivot('target_sets', 'target_reps')->withTimestamps();
    }

    public function workoutLogs()
    {
        return $this->hasMany(WorkoutLog::class);
    }
}
