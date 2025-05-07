<?php

namespace App\Models;

use App\Models\Readings;
use Illuminate\Database\Eloquent\Model;

class Streetlight extends Model
{
    protected $fillable = [
        'name',
        'location',
        'status',
    ];

    public function readings()
    {
        return $this->hasMany(Readings::class);
    }
}
