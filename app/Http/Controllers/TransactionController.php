<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Services\Midtrans\MidtransNotificationService;
use App\Models\PaymentMethod;
use App\Models\Cart;
use App\Models\MyCourse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class TransactionController extends Controller {
    public function index() {
        if (request()->wantsJson() && request()->ajax()) {
            return response()->json(Transaction::with(['payment_method'])->where('user_id', auth()->user()->id)->orderBy('id', 'DESC')->get());
        } else {
            return abort(404);
        }
    }

    public function detail($uuid) {
        if (request()->wantsJson() && request()->ajax()) {
            $transaction = Transaction::with(['courses.course', 'payment_method'])->where('uuid', $uuid)->first();
            return response()->json($transaction);
        } else {
            return abort(404);
        }
    }

    public function charge(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $data = $request->validate([
                'payment_method_uuid' => 'required|exists:payment_methods,uuid'
            ]);

            $carts = Cart::with(['course'])->where('user_id', auth()->user()->id)->get();
            if ($carts->count() === 0) {
                return response()->json([
                    'message' => 'Transaksi tidak bisa dilakukan dikarenakan tidak ada kelas dalam keranjang.'
                ], 400);
            }

            $amount = 0;
            foreach ($carts as $cart) {
                $amount += $cart->course->price - ($cart->course->price * $cart->course->discount);
            }

            DB::beginTransaction();

            $transaction = Transaction::create([
                'amount' => $amount,
                'user_id' => auth()->user()->id
            ]);

            foreach ($carts as $cart) {
                if (!MyCourse::where('user_id', auth()->user()->id)->where('course_id', $cart->course_id)->first()) {
                    $transaction->courses()->create([
                        'user_id' => auth()->user()->id,
                        'course_id' => $cart->course_id
                    ]);
                }
            }

            Cart::where('user_id', auth()->user()->id)->delete();

            $method = PaymentMethod::where('uuid', $data['payment_method_uuid'])->first();
            $body = $method->body;
            $body['transaction_details'] = [
                'order_id' => $transaction->uuid,
                'gross_amount' => $amount
            ];
            $body['customer_details'] = [
                'first_name' => auth()->user()->name,
                'email' => auth()->user()->email
            ];

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => base64_encode(config('midtrans.server_key') . ':')
            ])->post(config('midtrans.url') . '/charge', $body);

            if ($response->ok()) {
                $transaction->update([
                    'payment_method_id' => $method->id,
                    'identifier' => $response->collect('transaction_id')[0],
                    'body' => $response->json()
                ]);
                DB::commit();
            } else {
                DB::rollBack();
            }

            return response()->json($response->json(), $response->status());
        } else {
            return abort(404);
        }
    }

    public function notification(Request $request) {
        $service = new MidtransNotificationService;

        if ($service->isSignatureKeyVerified()) {
            $transaction = $service->getTransaction();
            $notification = $service->getNotification();

            $body = $transaction->body;
            $body['transaction_status'] = $notification->transaction_status;
            $body['status_code'] = $notification->status_code;

            if ($service->isSuccess()) {
                $body['settlement_time'] = $notification->settlement_time;
                $body['approval_code'] = $notification->approval_code;
                $transaction->update([
                    'status' => 'success',
                    'body' => $body,
                ]);
            }

            if ($service->isExpire()) {
                $transaction->update([
                    'status' => 'failed',
                    'body' => $body,
                ]);
            }

            if ($service->isCancelled()) {
                $transaction->update([
                    'status' => 'failed',
                    'body' => $body,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Notifikasi berhasil diproses',
            ]);
        } else {
            return response()->json([
                'error' => true,
                'message' => 'Signature key tidak terverifikasi',
            ], 403);
        }
    }

    public function cancel($uuid) {
        if (request()->wantsJson() && request()->ajax()) {
            $transaction = Transaction::where('uuid', $uuid)->first();
            if ($transaction->status === 'pending') {
                $response = Http::withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Authorization' => base64_encode(config('midtrans.server_key') . ':')
                ])->post(config('midtrans.url') . '/' . $transaction->uuid . '/cancel');

                if ($response->json()['status_code']) {
                    $body = $transaction->body;
                    $body['transaction_status'] = 'cancel';
                    $transaction->update([
                        'status' => 'failed',
                        'body' => $body,
                    ]);
                }

                return response()->json($response->json(), $response->json()['status_code']);
            } else {
                return response()->json([
                    'message' => 'Transaksi tidak bisa dibatalkan dikarenakan status transaksi bukan pending.'
                ], 400);
            }
        } else {
            return abort(404);
        }
    }
}
