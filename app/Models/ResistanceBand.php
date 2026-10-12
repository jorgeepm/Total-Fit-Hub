<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResistanceBand extends Model
{
    protected $table = 'bandas_elasticas';
    protected $fillable = ['user_id', 'color_nombre', 'peso_equivalente'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
