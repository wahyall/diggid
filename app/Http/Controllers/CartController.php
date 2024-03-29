<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Cart;
use App\Models\MyCourse;

class CartController extends Controller {
    public function index() {
        if (request()->wantsJson() && request()->ajax()) {
            $carts = Cart::with(['course.categories'])->where('user_id', request()->user()->id)->get();
            return response()->json($carts);
        } else {
            abort(404);
        }
    }

    public function store(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $course = Course::where('uuid', $request->course_uuid)->first();

            if (MyCourse::where('user_id', request()->user()->id)->where('course_id', $course->id)->exists()) {
                return response()->json(['status' => false, 'message' => 'Anda sudah membeli kursus ini'], 422);
            }

            $cart = Cart::firstOrCreate([
                'user_id' => request()->user()->id,
                'course_id' => $course->id
            ]);
            return response()->json($cart);
        } else {
            abort(404);
        }
    }

    public function destroy($uuid) {
        if (request()->wantsJson() && request()->ajax()) {
            Cart::where('uuid', $uuid)->delete();
            return response()->json(['status' => true]);
        } else {
            abort(404);
        }
    }
}
