<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code','credit','hours','url','name','name_en','description','description_en','visible',
    ];

    protected $casts = [
        'credit' => 'float',
        'hours' => 'integer',
        'visible' => 'boolean',
    ];

    public function programs()
    {
        return $this->belongsToMany(Program::class, 'program_courses');
    }
}

