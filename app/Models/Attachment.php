<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attachment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'attachable_type','attachable_id','type','title','file_url','external_url',
        'mime_type','file_size','alt_text','alt_text_en','sort_order',
    ];

    public function attachable()
    {
        return $this->morphTo();
    }
}

