<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DashboardMenu;
use Illuminate\Support\Facades\DB;

class DashboardMenuSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('dashboard_menus')->delete();

        $datas = [
            ['id' => 1, 'name' => 'Dashboard', 'component' => 'dashboard/Index', 'icon' => 'las la-home fs-2'],
        ];

        foreach ($datas as $data) {
            DashboardMenu::create($data);
        }
    }
}
