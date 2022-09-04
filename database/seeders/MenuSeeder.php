<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('menus')->truncate();

        $menus = [
            // Front
            ['name' => 'Home', 'path' => 'Index'],

            ['middleware' => 'auth|verified', 'children' => [
                // User
                ['name' => 'User', 'path' => 'user/Index'],
                ['name' => 'Kursus Saya', 'path' => 'user/kursus-saya/Index'],
                ['name' => 'Setting', 'path' => 'user/setting/Index'],

                // Redirecting Dashboard
                ['name' => 'Redirecting', 'path' => 'dashboard/Index', 'shown' => false, 'middleware' => 'role:admin,mentor'],

                ['middleware' => 'role:admin', 'children' => [
                    // Menu Dashboard Admin
                    ['name' => 'Dashboard', 'path' => 'dashboard/admin/Index', 'icon' => 'las la-home fs-2'],
                    ['name' => 'Kursus', 'path' => 'dashboard/admin/kursus/Index', 'icon' => 'las la-chalkboard-teacher fs-2'],
                    ['name' => 'Kategori', 'path' => 'dashboard/admin/kategori/Index', 'icon' => 'las la-tags fs-2'],
                ]],

                ['middleware' => 'role:mentor', 'children' => [
                    // Menu Dashboard Mentor
                    ['name' => 'Dashboard', 'path' => 'dashboard/mentor/Index', 'icon' => 'las la-home fs-2'],
                    ['name' => 'Kursus', 'path' => 'dashboard/mentor/kursus/Index', 'icon' => 'las la-chalkboard-teacher fs-2'],
                ]],
            ]],
        ];

        foreach ($menus as $menu) {
            if (!isset($menu['name'])) {
                $this->seedChildren($menu['children'], 0, $menu['middleware']);
            } else {
                $data = Menu::create(collect($menu)->except(['children'])->toArray());
                if (isset($menu['children'])) {
                    $this->seedChildren($menu['children'], $data->id, $menu['middleware']);
                }
            }
        }
    }

    private function seedChildren($menus, $parent_id, $parent_middleware) {
        foreach ($menus as $menu) {
            @$middleware = rtrim($parent_middleware . '|' . $menu['middleware'], '|');
            if (!isset($menu['name'])) {
                $this->seedChildren($menu['children'], $parent_id, $middleware);
            } else {
                $menu['parent_id'] = $parent_id;
                $menu['middleware'] = $middleware;
                $data = Menu::create(collect($menu)->except(['children'])->toArray());
                if (isset($menu['children'])) {
                    $this->seedChildren($menu['children'], $data->id, $middleware);
                }
            }
        }
    }
}
