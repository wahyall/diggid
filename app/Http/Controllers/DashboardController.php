<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;

class DashboardController extends Controller {
    public function menu() {
        if (request()->wantsJson()) {
            $menus = Menu::where('parent_id', 0)->where('route', 'LIKE', '%' . request()->user()->role . '%')->where('middleware', 'LIKE', '%' . request()->user()->role . '%')->get();

            return response()->json($menus);
        } else {
            return abort(404);
        }
    }
}
