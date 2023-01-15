<?php

namespace App\Http\Controllers;

use App\Models\CourseLessonVideo;
use Illuminate\Http\Request;
use App\Models\MyCourse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Iman\Streamer\VideoStreamer;

class MyCourseController extends Controller {
    public function index() {
        if (request()->wantsJson() && request()->ajax()) {
            $courses = MyCourse::with(['course'])->whereRelation('transaction', 'status', '=', 'success')->get();
            return response()->json($courses);
        } else {
            return abort(404);
        }
    }

    public function course($slug) {
        if (request()->wantsJson() && request()->ajax()) {
            $course = MyCourse::with(['course.lessons.videos'])->whereRelation('course', 'slug', '=', $slug)->whereRelation('transaction', 'status', '=', 'success')->first();

            if (!$course) return abort(404);
            return response()->json($course);
        } else {
            return abort(404);
        }
    }

    public function video($slug, $order) {
        if (request()->wantsJson() && request()->ajax()) {
            $video = CourseLessonVideo::whereHas('course', function (Builder $q) use ($slug) {
                $q->where('slug', $slug);
                $q->whereHas('purchases', function ($q) {
                    $q->where('status', 'success');
                    $q->where('user_id', auth()->user()->id);
                });
            })->where('order', $order)->first();

            if (!$video) return abort(404);
            return response()->json($video);
        } else {
            return abort(404);
        }
    }

    public function stream($slug, $order) {
        $video = CourseLessonVideo::whereHas('lesson.course', function ($q) use ($slug) {
            $q->where('slug', $slug);
            $q->whereHas('purchases', function ($q) {
                $q->where('status', 'success');
                $q->where('user_id', auth()->user()->id);
            });
        })->where('order', $order)->firstOrFail();

        if (!$video) return abort(403);
        if (!Storage::disk('private')->exists($video->video)) return abort(404);

        $file = storage_path('app/streaming/course/video/' . $video->uuid . '.m3u8');
        VideoStreamer::streamFile($file);
    }

    public function streamHls($slug, $order, $video) {
        $uuid = explode('_', $video)[0];
        $video = CourseLessonVideo::whereHas('lesson.course', function ($q) use ($slug) {
            $q->where('slug', $slug);
            $q->whereHas('purchases', function ($q) {
                $q->where('status', 'success');
                $q->where('user_id', auth()->user()->id);
            });
        })->where('order', $order)->firstOrFail();
        if (!$video) return abort(403);

        if (!Storage::disk('streaming')->exists($video))  return abort(404);

        return Storage::disk('streaming')->get($video);
    }
}
