<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseLesson;
use App\Models\CourseLessonVideo;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Support\Facades\Storage;

class CourseLessonVideoController extends Controller {
    public function index(Request $request, $uuid) {
        if (request()->wantsJson()) {
            $videos = CourseLessonVideo::whereHas('lesson', function ($q) use ($uuid) {
                $q->where('uuid', $uuid);
            })->when(isset($request->exclude) ?? false, function ($q) use ($request) {
                $q->whereNotIn('uuid', $request->exclude);
            })->orderBy('order')->get();

            $videos = $videos->map(function ($video) {
                $video->has_video = isset($video->video) && Storage::disk('private')->exists($video->video);
                return $video;
            });

            return response()->json($videos);
        } else {
            return abort(404);
        }
    }

    public function store(Request $request, $lesson_uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string',
                'description' => 'nullable|string',
            ]);

            $order = CourseLessonVideo::whereHas('lesson', function ($q) use ($lesson_uuid) {
                $q->where('uuid', $lesson_uuid);
            })->count() + 1;
            $video = CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->create([
                'name' => $request->name,
                'description' => $request->description,
                'order' => $order,
            ]);

            return response()->json([
                'message' => 'Video berhasil dibuat',
                'data' => $video
            ]);
        } else {
            return abort(404);
        }
    }

    public function edit($lesson_uuid, $uuid) {
        if (request()->wantsJson()) {
            $video = CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->where('uuid', $uuid)->first();
            if (isset($video->video)) {
                $video->file_size = Storage::disk('private')->size($video->video);
            }

            return response()->json($video);
        } else {
            return abort(404);
        }
    }


    public function update(Request $request, $lesson_uuid, $uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                'name' => 'required|string',
                'description' => 'nullable|string',
                'deleted_images' => 'nullable|array',
                'deleted_images.*' => 'nullable|string',
            ]);

            $video = CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->where('uuid', $uuid)->update([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            if (isset($request->deleted_images)) {
                foreach ($request->deleted_images as $image) {
                    if (file_exists(storage_path('app/public/' . str_replace(getenv('APP_URL') . '/storage/', '', $image)))) {
                        unlink(storage_path('app/public/' . str_replace(getenv('APP_URL') . '/storage/', '', $image)));
                    }
                }
            }

            $video = CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->where('uuid', $uuid)->first();

            return response()->json([
                'message' => 'Video berhasil diperbarui',
                'data' => $video
            ]);
        } else {
            return abort(404);
        }
    }

    public function upload(Request $request, $lesson_uuid, $uuid) {
        if (request()->wantsJson()) {
            try {
                $request->validate([
                    'video' => 'required|mimetypes:video/avi,video/mpeg,video/mp4|max:102400',
                ]);

                // Delete old video
                $video = CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->where('uuid', $uuid)->first();
                if (isset($video->video) && file_exists(storage_path('app/private/' . $video->video))) {
                    unlink(storage_path('app/private/' . $video->video));
                }

                CourseLessonVideo::where('uuid', $uuid)->update([
                    'video' => $request->video->store('course/video', 'private')
                ]);

                return response()->json([
                    'message' => 'Berhasil mengupload video'
                ]);
            } catch (\Throwable $th) {
                $video = CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->where('uuid', $uuid)->delete();
                return response()->json([
                    'message' => $th->getMessage(),
                ], 500);
            }
        } else {
            return abort(404);
        }
    }

    public function destroy($lesson_uuid, $uuid) {
        if (request()->wantsJson()) {
            $video = CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->where('uuid', $uuid)->first();
            $video->delete();

            // Update/Sync order
            $videos = CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->orderBy('order')->get();
            $videos->each(function ($video, $index) {
                $video->update([
                    'order' => $index + 1
                ]);
            });

            return response()->json([
                'message' => 'Video berhasil dihapus',
            ]);
        } else {
            return abort(404);
        }
    }

    public function reorder(Request $request, $lesson_uuid) {
        if (request()->wantsJson()) {
            $request->validate([
                '*.uuid' => 'required|string|exists:course_lesson_videos,uuid',
                '*.order' => 'required|integer'
            ]);

            foreach ($request->all() as $item) {
                CourseLesson::where('uuid', $lesson_uuid)->first()->videos()->where('uuid', $item['uuid'])->update([
                    'order' => $item['order']
                ]);
            }

            return response()->json([
                'message' => 'Video berhasil diurutkan',
            ]);
        } else {
            return abort(404);
        }
    }
}
