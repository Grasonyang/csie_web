<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'year','type','venue','doi','url','title','title_en','authors_text','authors_text_en','abstract','abstract_en','visible',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'year' => 'integer',
    ];
}

