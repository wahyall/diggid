<?php

namespace App\Http\Controllers;

use App\Models\Category;
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

            $category = Category::create([
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

    public function edit($uuid) {
        if (request()->wantsJson()) {
            $category = Category::where('uuid', $uuid)->first();
            return response()->json($category);
        } else {
            return abort(404);
        }
    }
}
