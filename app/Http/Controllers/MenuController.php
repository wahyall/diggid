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
            if (Cache::has('menu') && getenv('APP_ENV') !== 'local') {
                $menus = Cache::get('menu');
            } else {
                $menus = Menu::where('parent_id', 0)->get();
                Cache::put('menu', $menus, now()->addDays(30));
            }
            foreach ($menus as $menu) {
                if (!$menu->heading) {
                    $breadcrumb = [$menu->name];
                    $middleware = collect(explode('|', $menu->middleware))->filter(function ($role) {
                        return !!$role;
                    });

                    if ($menu->children->count() > 0 && !isset($menu->url)) {
                        self::generateRouteChildren($menu->children, $breadcrumb);
                    } else {
                        Route::get($menu->url, function () use ($menu, $breadcrumb) {
                            return Inertia::render($menu->component, [
                                'title' => $menu->name,
                                'breadcrumb' => $breadcrumb,
                            ]);
                        })->middleware($middleware->toArray())->name($menu->route);

                        if ($menu->children->count() > 0) {
                            self::generateRouteChildren($menu->children, $breadcrumb);
                        }
                    }
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
            if (!$menu->heading) {
                $breadcrumb[] = $menu->name;
                $middleware = collect(explode('|', $menu->middleware))->filter(function ($role) {
                    return !!$role;
                });

                if ($menu->children->count() > 0 && !isset($menu->url)) {
                    self::generateRouteChildren($menu->children, $breadcrumb);
                } else {
                    Route::get($menu->url, function () use ($menu, $breadcrumb) {
                        return Inertia::render($menu->component, [
                            'title' => $menu->name,
                            'breadcrumb' => $breadcrumb,
                        ]);
                    })->middleware($middleware->toArray())->name($menu->route);

                    if ($menu->children->count() > 0) {
                        self::generateRouteChildren($menu->children, $breadcrumb);
                    }
                }
            }
        }
    }
}
