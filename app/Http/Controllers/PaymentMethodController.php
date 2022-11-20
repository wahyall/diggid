<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentMethodController extends Controller {
    public function paginate(Request $request) {
        if (request()->wantsJson()) {
            $per = (($request->per) ? $request->per : 10);
            $page = (($request->page) ? $request->page - 1 : 0);

            DB::statement(DB::raw('set @nomor=0+' . $page * $per));
            $categories = PaymentMethod::where(function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

            return response()->json($categories);
        } else {
            return abort(404);
        }
    }

    public function show() {
        if (request()->wantsJson()) {
            return response()->json(PaymentMethod::where('is_active', '1')->get());
        } else {
            return abort(404);
        }
    }

    public function status(Request $request, $uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'is_active' => 'required',
            ]);

            PaymentMethod::where('uuid', $uuid)->update([
                'is_active' => $request->is_active
            ]);

            return response()->json([
                'message' => 'Berhasil memperbarui status Metode Pembayaran',
            ]);
        } else {
            return abort(404);
        }
    }
}
