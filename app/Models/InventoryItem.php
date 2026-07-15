<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'user_id',
        'department_id',
        'name',
        'sku',
        'category',
        'quantity',
        'minimum_stock',
        'unit_cost',
        'location',
        'status',
        'notes',
        'image_path',
    ];

    protected $appends = [
        'image_url',
    ];

    protected $casts = [
        'unit_cost' => 'decimal:2',
    ];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
