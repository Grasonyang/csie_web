<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id','email','phone','office','job_title','photo_url',
        'name','name_en','title','title_en','bio','bio_en','expertise','expertise_en','education','education_en',
        'sort_order','visible',
    ];

    protected $casts = [
        'visible' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function links()
    {
        return $this->hasMany(TeacherLink::class);
    }

    public function labs()
    {
        return $this->belongsToMany(Lab::class, 'lab_teachers');
    }
}

