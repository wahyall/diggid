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
            ['name' => 'Home', 'url' => '/', 'route' => 'home', 'component' => 'Index'],

            ['middleware' => 'auth|verified', 'children' => [
                // User
                ['name' => 'Profil', 'url' => 'me', 'route' => 'me', 'component' => 'me/Index'],
                ['name' => 'Kursus Saya', 'url' => 'me/course', 'route' => 'me.course', 'component' => 'me/course/Index'],
                ['name' => 'Setting', 'url' => 'me/setting', 'route' => 'me.setting', 'component' => 'me/setting/Index'],

                // Redirecting Dashboard
                ['name' => 'Redirecting', 'url' => 'dashboard', 'route' => 'dashboard', 'component' => 'dashboard/Index', 'shown' => false, 'middleware' => 'role:admin,mentor'],

                ['middleware' => 'role:admin', 'children' => [
                    // Menu Dashboard Admin
                    ['name' => 'Dashboard', 'url' => 'dashboard/admin', 'route' => 'dashboard.admin', 'component' => 'dashboard/admin/Index', 'icon' => 'las la-home fs-2'],

                    ['name' => 'Kursus', 'url' => 'dashboard/admin/course', 'route' => 'dashboard.admin.course', 'component' => 'dashboard/admin/course/Index', 'icon' => 'las la-chalkboard-teacher fs-2', 'children' => [
                        ['name' => 'Materi Kursus', 'url' => 'dashboard/admin/course/{uuid}/lesson', 'route' => 'dashboard.admin.course.lesson', 'component' => 'dashboard/admin/course/lesson/Index', 'shown' => false],
                    ]],

                    ['name' => 'Kategori', 'url' => 'dashboard/admin/category', 'route' => 'dashboard.admin.category', 'component' => 'dashboard/admin/category/Index', 'icon' => 'las la-tags fs-2'],
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
