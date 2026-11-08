<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavingsGoal extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'user_id', 'name', 'target_amount', 'current_amount', 'target_date', 'status', 'notes'];

    protected $casts = ['target_amount' => 'decimal:2', 'current_amount' => 'decimal:2', 'target_date' => 'date'];
}
