<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Models\MyCourse;

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

    public function index(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $startDate = null;
            $endDate = Carbon::now()->endOfDay()->format('Y-m-d H:i:s');

            if ($request->filter == 'week') {
                $startDate = Carbon::now()->subWeek()->addDay()->format('Y-m-d H:i:s');
            } else if ($request->filter == 'month') {
                $startDate = Carbon::now()->subMonth()->addDay()->format('Y-m-d H:i:s');
            } else if ($request->filter == 'year') {
                $startDate = Carbon::now()->subYear()->addDay()->format('Y-m-d H:i:s');
            } else {
                $startDate = Carbon::now()->subWeek()->addDay()->format('Y-m-d H:i:s');
            }

            $period = collect(CarbonPeriod::create($startDate, $endDate));
            if ($request->filter == 'year') {
                $period = $period->unique(function ($date) {
                    return $date->format('Y-m');
                })->values();
                $period->shift();
            }

            $chart = [];
            $chart['timestamps'] = $period->map(function ($date) {
                return (int) round(intval($date->format('Uu')) / pow(10, 3));
            });
            $chart['data'] = $period->map(function ($date) use ($request) {
                if ($request->filter == 'year') {
                    $data = MyCourse::whereMonth('created_at', $date->format('m'))
                        ->whereYear('created_at', $date->format('Y'));
                } else {
                    $data = MyCourse::with(['course'])->whereBetween('created_at', [$date->format('Y-m-d'), $date->addDay()->format('Y-m-d')])
                        ->whereYear('created_at', $date->format('Y'));
                }

                return [
                    'courses' => $data->count(),
                    'profit' => $data->withSum('course', 'price')->get()->sum('course_sum_price'),
                ];
            });

            $chart['courses'] = collect($chart['data'])->map(function ($data) {
                return $data['courses'];
            });
            $chart['profit'] = collect($chart['data'])->map(function ($data) {
                return $data['profit'];
            });
            unset($chart['data']);

            return response()->json($chart);
        } else {
            abort(404);
        }
    }
}
