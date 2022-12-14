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
            'name' => 'Bank BCA',
            'logo' => 'storage/payment/bank-bca.png',
            'body' => [
                'payment_type' => 'bank_transfer',
                'bank_transfer' => [
                    'bank' => 'bca'
                ]
            ],
        ]);

        PaymentMethod::create([
            'name' => 'Bank BRI',
            'logo' => 'storage/payment/bank-bri.png',
            'body' => [
                'payment_type' => 'bank_transfer',
                'bank_transfer' => [
                    'bank' => 'bri'
                ]
            ],
        ]);

        PaymentMethod::create([
            'name' => 'Bank BNI',
            'logo' => 'storage/payment/bank-bni.png',
            'body' => [
                'payment_type' => 'bank_transfer',
                'bank_transfer' => [
                    'bank' => 'bni'
                ]
            ],
        ]);

        PaymentMethod::create([
            'name' => 'GoPay',
            'logo' => 'storage/payment/gopay.svg',
            'body' => [
                'payment_type' => 'gopay',
            ],
        ]);

        PaymentMethod::create([
            'name' => 'Indomaret',
            'logo' => 'storage/payment/indomaret.png',
            'body' => [
                'payment_type' => 'cstore',
                'cstore' => [
                    'store' => 'indomaret'
                ]
            ],
        ]);

        PaymentMethod::create([
            'name' => 'Alfamart',
            'logo' => 'storage/payment/alfamart.svg',
            'body' => [
                'payment_type' => 'cstore',
                'cstore' => [
                    'store' => 'alfamart'
                ]
            ],
        ]);
    }
}
