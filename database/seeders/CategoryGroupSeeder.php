<?php

namespace Database\Seeders;

use App\Models\CategoryGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryGroupSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('category_groups')->delete();

        CategoryGroup::create([
            'id' => 1,
            'name' => 'Programming',
            'icon' => 'storage/category/programming.png',
            'caption' => 'Bikin Website & Aplikasi'
        ]);
        CategoryGroup::create([
            'id' => 2,
            'name' => 'Design',
            'icon' => 'storage/category/design.png',
            'caption' => 'UI/UX & Graphic Design'
        ]);
    }
}
