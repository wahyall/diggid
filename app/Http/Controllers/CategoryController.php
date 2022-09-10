<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller {
    public function paginate(Request $request) {
        if (request()->wantsJson()) {
            $per = (($request->per) ? $request->per : 10);
            $page = (($request->page) ? $request->page - 1 : 0);

            DB::statement(DB::raw('set @nomor=0+' . $page * $per));
            $categories = Category::where(function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

            return response()->json($categories);
        } else {
            return abort(404);
        }
    }

    public function store(Request $request) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'required|image'
            ]);

            Category::create([
                'name' => $request->name,
                'icon' => 'storage/' . $request->icon->store('category', 'public'),
            ]);

            return response()->json([
                'message' => 'Berhasil menambahkan kategori',
            ]);
        } else {
            return abort(404);
        }
    }

    public function detail($uuid) {
        if (request()->wantsJson()) {
            $category = Category::with(['subs'])->where('uuid', $uuid)->first();
            return response()->json($category);
        } else {
            return abort(404);
        }
    }

    public function edit($uuid) {
        if (request()->wantsJson()) {
            $category = Category::findByUuid($uuid);
            return response()->json($category);
        } else {
            return abort(404);
        }
    }

    public function update(Request $request, $uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'image'
            ]);

            $category = Category::findByUuid($uuid);

            // Delete icon
            if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $category->icon)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $category->icon)));
            }
            $category->update([
                'name' => $request->name,
                'icon' => 'storage/' . $request->icon->store('category', 'public'),
            ]);

            return response()->json([
                'message' => 'Berhasil mengubah kategori',
            ]);
        } else {
            return abort(404);
        }
    }

    public function destroy($uuid) {
        if (request()->wantsJson()) {
            $category = Category::findByUuid($uuid);

            // Delete all sub categories & a their icon
            SubCategory::whereHas('category', function ($q) use ($uuid) {
                $q->where('uuid', $uuid);
            })->pluck('icon')->each(function ($icon) {
                if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $icon)))) {
                    unlink(storage_path('app/public/' . str_replace('storage/', '', $icon)));
                }
            });

            $category->delete();

            return response()->json([
                'message' => 'Berhasil menghapus kategori',
            ]);
        } else {
            return abort(404);
        }
    }

    public function storeSub(Request $request, $uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'names' => 'required|array',
                'names.*' => 'required|string|max:255',
                'icons' => 'required|array',
                'icons.*' => 'required|image',
            ]);

            // Delete all sub categories and replace with new ones
            SubCategory::whereHas('category', function ($q) use ($uuid) {
                $q->where('uuid', $uuid);
            })->pluck('icon')->each(function ($icon) {
                if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $icon)))) {
                    unlink(storage_path('app/public/' . str_replace('storage/', '', $icon)));
                }
            });
            SubCategory::whereHas('category', function ($q) use ($uuid) {
                $q->where('uuid', $uuid);
            })->delete();

            $category = Category::findByUuid($uuid);

            foreach ($request->names as $index => $name) {
                $category->subs()->create([
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
