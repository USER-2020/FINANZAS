<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecurringTransaction extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'user_id', 'category_id', 'concept', 'type', 'amount', 'frequency', 'next_date', 'account', 'status', 'notes'];

    protected $casts = ['amount' => 'decimal:2', 'next_date' => 'date'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(PersonalCategory::class, 'category_id');
    }
}
