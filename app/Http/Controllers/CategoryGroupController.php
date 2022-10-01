<?php

namespace App\Http\Controllers;

use App\Models\CategoryGroup;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryGroupController extends Controller {
    public function paginate(Request $request) {
        if (request()->wantsJson()) {
            $per = (($request->per) ? $request->per : 10);
            $page = (($request->page) ? $request->page - 1 : 0);

            DB::statement(DB::raw('set @nomor=0+' . $page * $per));
            $categories = CategoryGroup::where(function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

            return response()->json($categories);
        } else {
            return abort(404);
        }
    }

    public function show() {
        if (request()->wantsJson()) {
            return response()->json(CategoryGroup::with(['categories'])->get());
        } else {
            return abort(404);
        }
    }

    public function store(Request $request) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'required|image',
                'caption' => 'required|string'
            ]);

            CategoryGroup::create([
                'name' => $request->name,
                'icon' => 'storage/' . $request->icon->store('category', 'public'),
                'caption' => $request->caption
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
            $category = CategoryGroup::with(['categories'])->where('uuid', $uuid)->first();
            return response()->json($category);
        } else {
            return abort(404);
        }
    }

    public function edit($uuid) {
        if (request()->wantsJson()) {
            $category = CategoryGroup::findByUuid($uuid);
            return response()->json($category);
        } else {
            return abort(404);
        }
    }

    public function update(Request $request, $uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'required|image',
                'caption' => 'required|string'
            ]);

            $category = CategoryGroup::findByUuid($uuid);

            // Delete icon
            if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $category->icon)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $category->icon)));
            }
            $category->update([
                'name' => $request->name,
                'icon' => 'storage/' . $request->icon->store('category', 'public'),
                'caption' => $request->caption
            ]);

            return response()->json([
                'message' => 'Berhasil memperbarui grup kategori',
            ]);
        } else {
            return abort(404);
        }
    }

    public function destroy($uuid) {
        if (request()->wantsJson()) {
            $category = CategoryGroup::findByUuid($uuid);

            // Delete all categories icon
            // note: the records is automatically deleted because it has cascade on delete
            CategoryGroup::whereHas('categories', function ($q) use ($uuid) {
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
}
