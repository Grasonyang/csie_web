<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'office',
        'phone',
        'specialty',
        'bio',
        'is_active',
        // Keep existing fields for compatibility
        'email','job_title','photo_url',
        'name','name_en','title','title_en','bio_en','expertise','expertise_en','education','education_en',
        'sort_order','visible',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Relationship: Teacher belongs to User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Existing relationships
     */
    public function links()
    {
        return $this->hasMany(TeacherLink::class);
    }

    public function labs()
    {
        return $this->belongsToMany(Lab::class, 'lab_teachers');
    }

    /**
     * Scope: Get active teachers
     */
    public function scopeActive($query)
    {
        return $query->where('visible', true);
    }

    /**
     * Scope: Search teachers by name or expertise
     */
    public function scopeSearch($query, $term)
    {
        return $query->whereHas('user', function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%");
        })->orWhere('expertise', 'like', "%{$term}%")
          ->orWhere('name', 'like', "%{$term}%"); // For backward compatibility
    }

    /**
     * Accessor: Get display name with expertise (mapped from specialty)
     */
    public function getDisplayNameAttribute()
    {
        $name = $this->user ? $this->user->name : ($this->name ?? 'Unknown');
        $specialty = $this->expertise ? " ({$this->expertise})" : '';
        return $name . $specialty;
    }

    /**
     * Accessor: Get full teacher info
     */
    public function getFullInfoAttribute()
    {
        return [
            'name' => $this->user ? $this->user->name : ($this->name ?? 'Unknown'),
            'email' => $this->user ? $this->user->email : ($this->email ?? ''),
            'office' => $this->office,
            'phone' => $this->phone,
            'specialty' => $this->expertise, // Map expertise to specialty
            'bio' => $this->bio,
            'is_active' => $this->visible ?? true, // Map visible to is_active
        ];
    }

    /**
     * Accessor: Map specialty to expertise for backward compatibility
     */
    public function getSpecialtyAttribute()
    {
        return $this->expertise;
    }

    /**
     * Mutator: Map specialty to expertise for backward compatibility
     */
    public function setSpecialtyAttribute($value)
    {
        $this->attributes['expertise'] = $value;
    }

    /**
     * Accessor: Map is_active to visible for backward compatibility
     */
    public function getIsActiveAttribute()
    {
        return $this->visible ?? true;
    }

    /**
     * Mutator: Map is_active to visible for backward compatibility
     */
    public function setIsActiveAttribute($value)
    {
        $this->attributes['visible'] = $value;
    }
}

