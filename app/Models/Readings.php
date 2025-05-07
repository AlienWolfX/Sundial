<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Readings extends Model
{
    protected $fillable = [
        'streetlight_id',
        'voltage_batt',
        'current_batt',
        'voltage_solar',
        'current_solar',
        'voltage_load',
        'current_load',
    ];

    public function streetlight()
    {
        return $this->belongsTo(Streetlight::class);
    }
}
