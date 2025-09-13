<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code','level','website_url','name','name_en','description','description_en','visible','sort_order',
    ];

    protected $casts = [
        'visible' => 'boolean',
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'program_courses');
    }
}

