<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\CategoryGroup;

class CategoryController extends Controller {
    public function massStore(Request $request) {
        if (request()->wantsJson()) {
            $request->validate([
                'names' => 'required|array',
                'names.*' => 'required|string|max:255',
                'icons' => 'required|array',
                'icons.*' => 'required|image',
                'category_group_uuid' => 'required|string'
            ]);

            // Delete all categories and replace with new ones
            Category::whereHas('group', function ($q) use ($request) {
                $q->where('uuid', $request->category_group_uuid);
            })->pluck('icon')->each(function ($icon) {
                if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $icon)))) {
                    unlink(storage_path('app/public/' . str_replace('storage/', '', $icon)));
                }
            });
            Category::whereHas('group', function ($q) use ($request) {
                $q->where('uuid', $request->category_group_uuid);
            })->delete();

            $group = CategoryGroup::findByUuid($request->category_group_uuid);

            foreach ($request->names as $index => $name) {
                $group->categories()->create([
                    'name' => $name,
                    'icon' => 'storage/' . $request->icons[$index]->store('category', 'public'),
                ]);
            }

            return response()->json([
                'message' => 'Berhasil menambahkan sub kategori',
            ]);
        } else {
            return abort(404);
        }
    }
}
