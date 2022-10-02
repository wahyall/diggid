<?php

namespace App\Http\Controllers;

use App\Models\CategoryGroup;
use Illuminate\Http\Request;

class CatalogController extends Controller {
    public function category(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            return response()->json(CategoryGroup::with('categories')->whereHas('categories')->get());
        } else {
            abort(404);
        }
    }
}
