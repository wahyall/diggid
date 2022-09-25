<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Services\Midtrans\PaymentNotification;


class TransactionController extends Controller {
    public function receive(Request $request) {
        $notif = new PaymentNotification;

        if ($notif->isSignatureKeyVerified()) {
            $transaction = $notif->getTransaction();

            if ($notif->isSuccess()) {
                $transaction->update([
                    'payment_status' => 'success',
                ]);
            }

            if ($notif->isExpire()) {
                $transaction->update([
                    'payment_status' => 'expired',
                ]);
            }

            if ($notif->isCancelled()) {
                $transaction->update([
                    'payment_status' => 'cancelled',
                ]);
            }

            return response()
                ->json([
                    'success' => true,
                    'message' => 'Notifikasi berhasil diproses',
                ]);
        } else {
            return response()
                ->json([
                    'error' => true,
                    'message' => 'Signature key tidak terverifikasi',
                ], 403);
        }
    }
}
