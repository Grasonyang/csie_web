<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
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
        'source_type',
        'source_url',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'publish_at' => 'datetime',
            'expire_at' => 'datetime',
            'pinned' => 'boolean',
            'source_type' => 'string',
            'source_url' => 'string',
        ];
    }

    // 關聯
    public function category()
    {
        return $this->belongsTo(PostCategory::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    /**
     * Scope a query to only include published and active posts.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', 'published')
            ->where(function (Builder $subQuery) {
                $subQuery
                    ->whereNull('publish_at')
                    ->orWhere('publish_at', '<=', now());
            })
            ->where(function (Builder $subQuery) {
                $subQuery
                    ->whereNull('expire_at')
                    ->orWhere('expire_at', '>', now());
            });
    }
}
