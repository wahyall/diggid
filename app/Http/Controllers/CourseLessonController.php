<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\CourseLesson;

class CourseLessonController extends Controller {
    public function index($uuid) {
        if (request()->wantsJson()) {
            $lessons = CourseLesson::whereHas('course', function ($q) use ($uuid) {
                $q->where('uuid', $uuid);
            })->orderBy('order')->get();

            return response()->json($lessons);
        } else {
            return abort(404);
        }
    }

    public function store(Request $request, $course_uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string',
                'description' => 'required|string'
            ]);

            $order = CourseLesson::whereHas('course', function ($q) use ($course_uuid) {
                $q->where('uuid', $course_uuid);
            })->count() + 1;
            Course::where('uuid', $course_uuid)->first()->lessons()->create([
                'name' => $request->name,
                'description' => $request->description,
                'order' => $order
            ]);

            return response()->json([
                'message' => 'Materi berhasil dibuat',
            ]);
        } else {
            return abort(404);
        }
    }

    public function edit($course_uuid, $uuid) {
        if (request()->wantsJson()) {
            $lesson = Course::where('uuid', $course_uuid)->first()->lessons()->where('uuid', $uuid)->first();

            return response()->json($lesson);
        } else {
            return abort(404);
        }
    }


    public function update(Request $request, $course_uuid, $uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string',
                'description' => 'required|string'
            ]);

            Course::where('uuid', $course_uuid)->first()->lessons()->where('uuid', $uuid)->update([
                'name' => $request->name,
                'description' => $request->description
            ]);

            return response()->json([
                'message' => 'Materi berhasil diperbarui',
            ]);
        } else {
            return abort(404);
        }
    }

    public function destroy($course_uuid, $uuid) {
        if (request()->wantsJson()) {
            Course::where('uuid', $course_uuid)->first()->lessons()->where('uuid', $uuid)->delete();

            // Update/Sync order
            $lessons = Course::where('uuid', $course_uuid)->first()->lessons()->orderBy('order')->get();
            $lessons->each(function ($lesson, $index) {
                $lesson->update([
                    'order' => $index + 1
                ]);
            });

            return response()->json([
                'message' => 'Materi berhasil dihapus',
            ]);
        } else {
            return abort(404);
        }
    }

    public function reorder(Request $request, $course_uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                '*.uuid' => 'required|string|exists:course_lessons,uuid',
                '*.order' => 'required|integer'
            ]);

            foreach ($request->all() as $item) {
                Course::where('uuid', $course_uuid)->first()->lessons()->where('uuid', $item['uuid'])->update([
                    'order' => $item['order']
                ]);
            }

            return response()->json([
                'message' => 'Materi berhasil diurutkan',
            ]);
        } else {
            return abort(404);
        }
    }
}
