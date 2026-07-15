<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = [
            ['name' => 'Efectivo', 'code' => 'cash'],
            ['name' => 'Transferencia bancaria', 'code' => 'bank_transfer'],
            ['name' => 'Tarjeta de crédito', 'code' => 'credit_card'],
            ['name' => 'Tarjeta débito', 'code' => 'debit_card'],
            ['name' => 'PSE', 'code' => 'pse'],
            ['name' => 'Nequi', 'code' => 'nequi'],
            ['name' => 'Daviplata', 'code' => 'daviplata'],
            ['name' => 'Crédito proveedor', 'code' => 'supplier_credit'],
        ];

        foreach ($paymentMethods as $index => $paymentMethod) {
            PaymentMethod::updateOrCreate(
                ['code' => $paymentMethod['code']],
                [
                    'name' => $paymentMethod['name'],
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }
}
