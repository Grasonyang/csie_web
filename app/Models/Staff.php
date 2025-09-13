<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'email','phone','photo_url','name','name_en','position','position_en','bio','bio_en','sort_order','visible',
    ];

    protected $casts = [
        'visible' => 'boolean',
    ];
}

