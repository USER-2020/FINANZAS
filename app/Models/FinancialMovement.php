<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class FinancialMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'user_id',
        'department_id',
        'category_id',
        'concept',
        'merchant_name',
        'invoice_number',
        'invoice_nit',
        'type',
        'amount',
        'movement_date',
        'status',
        'payment_method',
        'account',
        'description',
        'image_path',
        'source_hash',
        'ocr_raw_text',
        'ocr_confidence',
    ];

    protected $appends = [
        'image_url',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'movement_date' => 'date',
        'ocr_confidence' => 'decimal:4',
    ];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? route('financial-movements.image', $this->getKey()) : null;
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PersonalCategory::class, 'category_id');
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
