<?php

namespace Database\Seeders;

use App\Models\PersonalCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class PersonalFinanceSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Vivienda', 'type' => 'Gasto', 'color' => '#38bdf8'],
            ['name' => 'Alimentación', 'type' => 'Gasto', 'color' => '#34d399'],
            ['name' => 'Transporte', 'type' => 'Gasto', 'color' => '#a78bfa'],
            ['name' => 'Salud', 'type' => 'Gasto', 'color' => '#fb7185'],
            ['name' => 'Ocio', 'type' => 'Gasto', 'color' => '#fbbf24'],
            ['name' => 'Salario', 'type' => 'Ingreso', 'color' => '#2dd4bf'],
            ['name' => 'Otros ingresos', 'type' => 'Ingreso', 'color' => '#60a5fa'],
        ];

        User::query()->whereNotNull('client_id')->get()->each(function (User $user) use ($categories): void {
            foreach ($categories as $category) {
                PersonalCategory::firstOrCreate(
                    ['client_id' => $user->client_id, 'user_id' => $user->id, 'name' => $category['name']],
                    [...$category, 'status' => 'Activo'],
                );
            }
        });
    }
}
