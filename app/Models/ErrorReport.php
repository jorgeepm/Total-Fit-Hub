<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ErrorReport extends Model
{
    protected $fillable = ['user_id', 'subject', 'description', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
