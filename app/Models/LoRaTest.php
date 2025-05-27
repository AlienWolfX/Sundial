<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoRaTest extends Model
{
    protected $table = 'lora_test';
    protected $fillable = ['message'];
}
