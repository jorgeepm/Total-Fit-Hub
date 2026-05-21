<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaterLog extends Model
{
    protected $fillable = ['user_id', 'date', 'glasses'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
