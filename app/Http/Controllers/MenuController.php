<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use Exception;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;

class MenuController extends Controller {
    public static function generateRoute() {
        try {
            if (Cache::has('menu')) {
                $menus = Cache::get('menu');
            } else {
                $menus = Menu::where('parent_id', 0)->get();
                Cache::put('menu', $menus, now()->addDays(30));
            }
            foreach ($menus as $menu) {
                $component = $menu->path;
                $url = str_replace('Index', '', $menu->path);
                $route_name = rtrim(str_replace('/', '.', $url), '.');
                $breadcrumb = [$menu->name];

                $middleware = collect(explode('|', $menu->middleware))->filter(function ($role) {
                    return !!$role;
                });

                if ($menu->children->count() > 0) {
                    self::generateRouteChildren($menu->children, $breadcrumb);
                } else {
                    Route::get($url, function () use ($menu, $breadcrumb, $component) {
                        return Inertia::render($component, [
                            'title' => $menu->name,
                            'breadcrumb' => $breadcrumb,
                        ]);
                    })->middleware($middleware->toArray())->name($route_name ? $route_name : 'home');
                }
            }
        } catch (Exception $e) {
            echo '*************************************' . PHP_EOL;
            echo 'Error fetching database menus: ' . PHP_EOL;
            echo $e->getMessage() . PHP_EOL;
            echo '*************************************' . PHP_EOL;
        }
    }

    public static function generateRouteChildren($childrens, $breadcrumb) {
        foreach ($childrens as $menu) {
            $component = $menu->path;
            $url = str_replace('Index', '', $menu->path);
            $route_name = rtrim(str_replace('/', '.', $url), '.');
            $breadcrumb[] = $menu->name;

            $middleware = collect(explode('|', $menu->middleware))->filter(function ($role) {
                return !!$role;
            });

            if ($menu->children->count() > 0) {
                self::generateRouteChildren($menu->children, $breadcrumb);
            } else {
                Route::get($url, function () use ($menu, $breadcrumb, $component) {
                    return Inertia::render($component, [
                        'title' => $menu->name,
                        'breadcrumb' => $breadcrumb,
                    ]);
                })->middleware($middleware->toArray())->name($route_name);
            }
        }
    }

    public function menus() {
        if (request()->wantsJson()) {
            $menus = Menu::where('parent_id', 0)->where('middleware', 'LIKE', '%' . request()->user()->role . '%')->get();

            return response()->json($menus);
        } else {
            return abort(404);
        }
    }
}
