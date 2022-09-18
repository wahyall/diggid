<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller {
    public function paginate(Request $request) {
        if (request()->wantsJson()) {
            $per = (($request->per) ? $request->per : 10);
            $page = (($request->page) ? $request->page - 1 : 0);

            DB::statement(DB::raw('set @nomor=0+' . $page * $per));
            $courses = Course::where(function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

            return response()->json($courses);
        } else {
            return abort(404);
        }
    }

    public function store(Request $request) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string|max:255',
                'thumbnail' => 'required|image',
                'price' => 'required',
                'discount' => 'nullable',
                'finish_estimation' => 'nullable|integer',
                'description' => 'required|string',
                'category_uuids' => 'required|array',
                'category_uuids.*' => 'required|exists:categories,uuid',
                'sneak_peeks' => 'nullable|array',
                'sneak_peeks.*' => 'nullable|image',
            ]);

            $price = str_replace('.', '', $request->price);
            $price = str_replace(',', '.', $price);

            $discount = str_replace('.', '', $request->discount);
            $discount = str_replace(',', '.', $discount);

            $course = Course::create([
                'name' => $request->name,
                'thumbnail' => 'storage/' . $request->thumbnail->store('course/thumbnail', 'public'),
                'price' => $price,
                'discount' => $discount ? $discount : 0,
                'finish_estimation' => $request->finish_estimation,
                'description' => $request->description,
            ]);

            $categories = Category::whereIn('uuid', $request->category_uuids)->pluck('id');
            $course->categories()->sync($categories);

            if ($request->sneak_peeks) {
                foreach ($request->file('sneak_peeks') as $sneak_peek) {
                    $course->addMedia($sneak_peek)->usingFileName($sneak_peek->hashName())->toMediaCollection('sneak_peeks');
                }
            }

            return response()->json([
                'message' => 'Berhasil menambahkan kategori',
            ]);
        } else {
            return abort(404);
        }
    }

    public function show($uuid) {
        if (request()->wantsJson()) {
            return response()->json(Course::findByUuid($uuid));
        } else {
            return abort(404);
        }
    }

    public function edit($uuid) {
        if (request()->wantsJson()) {
            $category = Course::with(['categories'])->where('uuid', $uuid)->first()->append('sneak_peeks');
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

            $course = Course::findByUuid($uuid);

            // Delete thumbnail
            if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $course->thumbnail)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $course->thumbnail)));
            }

            $price = str_replace('.', '', $request->price);
            $price = str_replace(',', '.', $price);

            $discount = str_replace('.', '', $request->discount);
            $discount = str_replace(',', '.', $discount);

            $course->update([
                'name' => $request->name,
                'thumbnail' => 'storage/' . $request->thumbnail->store('course/thumbnail', 'public'),
                'price' => $price,
                'discount' => $discount ? $discount : 0,
                'finish_estimation' => $request->finish_estimation,
                'description' => $request->description,
            ]);

            $categories = Category::whereIn('uuid', $request->category_uuids)->pluck('id');
            $course->categories()->sync($categories);

            $course->clearMediaCollection('sneak_peeks');
            if ($request->sneak_peeks) {
                foreach ($request->file('sneak_peeks') as $sneak_peek) {
                    $course->addMedia($sneak_peek)->usingFileName($sneak_peek->hashName())->toMediaCollection('sneak_peeks');
                }
            }

            return response()->json([
                'message' => 'Berhasil mengubah kategori',
            ]);
        } else {
            return abort(404);
        }
    }

    public function destroy($uuid) {
        if (request()->wantsJson()) {
            $category = Course::findByUuid($uuid);

            // Delete thumbnail
            if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $category->thumbnail)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $category->thumbnail)));
            }

            $category->delete();

            return response()->json([
                'message' => 'Berhasil menghapus kategori',
            ]);
        } else {
            return abort(404);
        }
    }

    public function uploadImage(Request $request) {
        $file = 'storage/' . $request->upload->store('course', 'public');
        return response()->json([
            'url' => asset($file)
        ]);
    }

    public function deleteImage(Request $request) {
        if (file_exists(storage_path('app/public/' . str_replace(getenv('APP_URL') . '/storage/', '', $request->url)))) {
            unlink(storage_path('app/public/' . str_replace(getenv('APP_URL') . '/storage/', '', $request->url)));
        }
        return response()->json([
            'message' => 'Image deleted successfuly!'
        ]);
    }
}
