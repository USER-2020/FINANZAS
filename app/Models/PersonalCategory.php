<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalCategory extends Model
{
    use HasFactory;

    protected $table = 'personal_categories';

    protected $fillable = ['client_id', 'user_id', 'name', 'type', 'color', 'status', 'notes'];
}
