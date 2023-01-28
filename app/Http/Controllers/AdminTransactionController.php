<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminTransactionController extends Controller {
    public function paginate(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $per = (($request->per) ? $request->per : 10);
            $page = (($request->page) ? $request->page - 1 : 0);

            DB::statement(DB::raw('set @nomor=0+' . $page * $per));
            $transactions = Transaction::with(['user', 'payment_method'])->where(function ($q) use ($request) {
                $q->orWhereHas('user', function ($q) use ($request) {
                    $q->where('name', 'LIKE', '%' . $request->search . '%');
                });
                $q->orWhereHas('payment_method', function ($q) use ($request) {
                    $q->where('name', 'LIKE', '%' . $request->search . '%');
                });
            })->when(isset($request->status), function ($q) use ($request) {
                $q->where('status', $request->status);
            })->orderBy('id', 'DESC')->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

            return response()->json($transactions);
        } else {
            return abort(404);
        }
    }

    public function detail($uuid) {
        if (request()->wantsJson() && request()->ajax()) {
            $transaction = Transaction::with(['user', 'payment_method', 'courses.course'])->where('uuid', $uuid)->firstOrFail();

            return response()->json($transaction);
        } else {
            return abort(404);
        }
    }

    public function report($uuid) {
        if (request()->ajax()) {
            $transaction = Transaction::with(['user', 'payment_method', 'courses.course'])->where('uuid', $uuid)->firstOrFail();

            $pdf = Pdf::loadView('report.transaction', compact('transaction'));
            return $pdf->stream("Laporan Transaksi User " . $transaction->user->name . " - Tanggal " . $transaction->date . ".pdf");
        } else {
            return abort(404);
        }
    }
}
