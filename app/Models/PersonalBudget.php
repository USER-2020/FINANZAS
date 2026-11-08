<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonalBudget extends Model
{
    use HasFactory;

    protected $table = 'personal_budgets';

    protected $fillable = ['client_id', 'user_id', 'category_id', 'name', 'amount', 'period', 'start_date', 'end_date', 'status'];

    protected $casts = ['amount' => 'decimal:2', 'start_date' => 'date', 'end_date' => 'date'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(PersonalCategory::class, 'category_id');
    }
}
