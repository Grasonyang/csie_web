<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'slug',
        'status',
        'publish_at',
        'expire_at',
        'pinned',
        'cover_image_url',
        'title',
        'title_en',
        'summary',
        'summary_en',
        'content',
        'content_en',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'publish_at' => 'datetime',
            'expire_at' => 'datetime',
            'pinned' => 'boolean',
        ];
    }

    // 關聯
    public function category()
    {
        return $this->belongsTo(PostCategory::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}

