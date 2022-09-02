<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DashboardMenu;
use Exception;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

class DashboardMenuController extends Controller {
    // Generate route for Dashboard 
    public static function generateRoute() {
        try {
            $menus = DashboardMenu::where('parent_id', 0)->get();
            foreach ($menus as $menu) {
                $named_route = $menu->slug;
                $breadcrumb = [$menu->name];
                $middleware = collect(explode(',', $menu->role_accesses))->filter(function ($role) {
                    return !!$role;
                })->map(function ($role) {
                    return $role . '.access';
                });
                $middleware = $middleware->merge(['auth', 'verified']);

                if ($menu->children->count() > 0) {
                    self::generateRouteChildren($menu->children, $named_route, $breadcrumb);
                } else {
                    Route::get($menu->slug, function () use ($menu, $breadcrumb) {
                        return Inertia::render($menu->component, [
                            'title' => $menu->name,
                            'breadcrumb' => $breadcrumb,
                        ]);
                    })->prefix($menu->slug !== 'dashboard' ? 'dashboard' : '')->middleware($middleware)->name($named_route === 'dashboard' ? 'dashboard.home' : 'dashboard.' . $named_route);
                }
            }
        } catch (Exception $e) {
            echo '*************************************' . PHP_EOL;
            echo 'Error fetching database menus: ' . PHP_EOL;
            echo $e->getMessage() . PHP_EOL;
            echo '*************************************' . PHP_EOL;
        }
    }

    public static function generateRouteChildren($childrens, $parent_route, $breadcrumb) {
        foreach ($childrens as $menu) {
            $named_route = $parent_route . '/' . $menu->slug;
            $breadcrumb[] = $menu->name;
            $middleware = collect(explode(',', $menu->role_accesses))->filter(function ($role) {
                return !!$role;
            })->map(function ($role) {
                return $role . '.access';
            });
            $middleware = $middleware->merge(['auth', 'verified']);

            if ($menu->children->count() > 0) {
                self::generateRouteChildren($menu->children, $named_route, $breadcrumb);
            } else {
                Route::get($parent_route . '/' . $menu->slug, function () use ($menu, $breadcrumb) {
                    return Inertia::render($menu->component, [
                        'title' => $menu->name,
                        'breadcrumb' => $breadcrumb,
                    ]);
                })->prefix('dashboard')->middleware($middleware)->name(str_replace('/', '.', 'dashboard/' . $named_route));
            }
        }
    }

    public function menus() {
        if (request()->wantsJson()) {
            $menus = DashboardMenu::where('parent_id', 0)->where('role_accesses', '%' . request()->user()->role . '%')->get();

            return response()->json($menus);
        } else {
            return abort(404);
        }
    }
}
