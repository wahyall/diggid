<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\DB;

class PaymentMethodSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('payment_methods')->delete();

        PaymentMethod::create([
            'name' => 'Indomaret',
            'slug' => 'indomaret',
            'logo' => 'storage/payment/indomaret.png',
            'body' => [
                'payment_type' => 'cstore',
                'cstore' => [
                    'store' => 'indomaret'
                ]
            ],
        ]);
    }
}
