<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'actor_id',
        'action',
        'target_type',
        'target_id',
        'metadata',
        'reason',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function target()
    {
        return $this->morphTo('target', 'target_type', 'target_id');
    }

    public static function logAction(string $action, Model $target, ?User $actor = null, ?array $metadata = null, ?string $reason = null): self
    {
        return static::create([
            'actor_id' => $actor?->id ?? auth()->id(),
            'action' => $action,
            'target_type' => get_class($target),
            'target_id' => $target->id,
            'metadata' => $metadata,
            'reason' => $reason,
        ]);
    }
}
