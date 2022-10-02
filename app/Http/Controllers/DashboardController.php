<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;

class DashboardController extends Controller {
    public function menu() {
        if (request()->wantsJson()) {
            $menus = Menu::with(['children' => function ($q) {
                $q->where('shown', true);
            }])->where('parent_id', 0)->where(function ($q) {
                $q->where('route', 'LIKE', '%' . request()->user()->role . '%');
                $q->orWhere('middleware', 'LIKE', '%' . request()->user()->role . '%');
            })->where('shown', 1)->get();

            return response()->json($menus);
        } else {
            return abort(404);
        }
    }
}
