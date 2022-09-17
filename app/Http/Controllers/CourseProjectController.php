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
    }

    public function update(Request $request, $uuid) {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string'
        ]);

        Course::where('uuid', $uuid)->first()->project()->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json([
            'message' => 'Proyek berhasil diperbarui',
        ]);
    }

    public function destroy($uuid) {
        Course::where('uuid', $uuid)->first()->project()->delete();

        return response()->json([
            'message' => 'Proyek berhasil dihapus',
        ]);
    }
}
