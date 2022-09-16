<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('categories')->delete();

        Category::create([
            'name' => 'Frontend',
            'category_group_id' => 1,
        ]);
        Category::create([
            'name' => 'Backend',
            'category_group_id' => 1,
        ]);

        Category::create([
            'name' => 'UI/UX',
            'category_group_id' => 2,
        ]);
        Category::create([
            'name' => 'Illustrator',
            'category_group_id' => 2,
        ]);
    }
}
