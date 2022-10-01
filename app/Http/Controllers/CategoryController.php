<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\CategoryGroup;

class CategoryController extends Controller {
    public function sync(Request $request) {
        if (request()->wantsJson()) {
            $request->validate([
                'subs' => 'required|array',
                'subs.*.uuid' => 'required|string',
                'subs.*.name' => 'required|string|max:179',
                'subs.*.icon' => 'required|image',
                'category_group_uuid' => 'required|string'
            ]);

            $group = CategoryGroup::where('uuid', $request->category_group_uuid)->first();

            // Delete old icon
            $group->categories()->get()->each(function ($category) {
                if (isset($category->icon) && file_exists(storage_path('app/public/' . str_replace('storage/', '', $category->icon)))) {
                    unlink(storage_path('app/public/' . str_replace('storage/', '', $category->icon)));
                }
            });

            foreach ($request->subs as $sub) {
                $group->categories()->updateOrCreate([
                    'uuid' => $sub['uuid']
                ], [
                    'name' => $sub['name'],
                    'icon' => 'storage/' . $sub['icon']->store('category', 'public'),
                ]);
            }

            // Delete category when not found in request (it's deleted)
            $uuids = [];
            foreach ($request->subs as $sub) {
                array_push($uuids, $sub['uuid']);
            }
            $group->categories()->whereNotIn('uuid', $uuids)->delete();

            return response()->json([
                'message' => 'Berhasil memperbarui kategori',
            ]);
        } else {
            return abort(404);
        }
    }
}
