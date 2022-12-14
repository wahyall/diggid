<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MyCourse;

class MyCourseController extends Controller {
    public function index() {
        if (request()->wantsJson() && request()->ajax()) {
            $courses = MyCourse::with(['course'])->whereRelation('transaction', 'status', '=', 'success')->get();
            return response()->json($courses);
        } else {
            return abort(404);
        }
    }
}
