<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\CourseProject;

class CourseProjectController extends Controller {
    public function index($uuid) {
        if (request()->wantsJson()) {
            $project = Course::with('project')->where('uuid', $uuid)->first();

            return response()->json($project);
        } else {
            return abort(404);
        }
    }

    public function store(Request $request, $uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string',
                'description' => 'required|string'
            ]);

            Course::where('uuid', $uuid)->first()->project()->create([
                'name' => $request->name,
                'description' => $request->description
            ]);

            return response()->json([
                'message' => 'Proyek berhasil dibuat',
            ]);
        } else {
            return abort(404);
        }
    }

    public function update(Request $request, $uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string',
                'description' => 'required|string',
                'deleted_images' => 'nullable|array',
                'deleted_images.*' => 'nullable|string',
            ]);

            Course::where('uuid', $uuid)->first()->project()->update([
                'name' => $request->name,
                'description' => $request->description
            ]);

            if (isset($request->deleted_images)) {
                foreach ($request->deleted_images as $image) {
                    if (file_exists(storage_path('app/public/' . str_replace(getenv('APP_URL') . '/storage/', '', $image)))) {
                        unlink(storage_path('app/public/' . str_replace(getenv('APP_URL') . '/storage/', '', $image)));
                    }
                }
            }

            return response()->json([
                'message' => 'Proyek berhasil diperbarui',
            ]);
        } else {
            return abort(404);
        }
    }

    public function destroy($uuid) {
        if (request()->wantsJson()) {
            Course::where('uuid', $uuid)->first()->project()->delete();

            return response()->json([
                'message' => 'Proyek berhasil dihapus',
            ]);
        } else {
            return abort(404);
        }
    }
}
