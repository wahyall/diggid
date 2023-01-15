<?php

namespace App\Http\Controllers;

use App\Models\CourseLessonVideo;
use Illuminate\Http\Request;
use App\Models\MyCourse;
use App\Models\MyCourseProgress;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Iman\Streamer\VideoStreamer;
use Illuminate\Support\Facades\URL;

class MyCourseController extends Controller {
    public function index() {
        if (request()->wantsJson() && request()->ajax()) {
            $courses = MyCourse::with(['course.categories'])->whereRelation('transaction', 'status', '=', 'success')->get();
            return response()->json($courses);
        } else {
            return abort(404);
        }
    }

    public function course($course) {
        if (request()->wantsJson() && request()->ajax()) {
            $course = MyCourse::with(['course.lessons.videos'])->whereRelation('course', 'slug', '=', $course)->whereRelation('transaction', 'status', '=', 'success')->first();

            if (!$course) return abort(404);
            return response()->json($course);
        } else {
            return abort(404);
        }
    }

    public function video($course, $lesson, $video) {
        if (request()->wantsJson() && request()->ajax()) {
            $video = CourseLessonVideo::with(['lesson'])->whereHas('lesson.course', function (Builder $q) use ($course) {
                $q->where('slug', $course);
                $q->whereHas('purchases.transaction', function ($q) {
                    $q->where('status', 'success');
                    $q->where('user_id', auth()->user()->id);
                });
            })->whereRelation('lesson', 'slug', '=', $lesson)->where('slug', $video)->first();
            if (!$video) return abort(404);

            $video->url = URL::temporarySignedRoute('video.stream.secure', now()->addMinutes(5), [
                'course' => $course,
                'lesson' => $lesson,
                'video' => $video->slug
            ]);

            return response()->json($video);
        } else {
            return abort(404);
        }
    }

    public function stream($course, $lesson, $video) {
        $video = CourseLessonVideo::whereHas('lesson.course', function ($q) use ($course) {
            $q->where('slug', $course);
            $q->whereHas('purchases.transaction', function ($q) {
                $q->where('status', 'success');
                $q->where('user_id', auth()->user()->id);
            });
        })->whereRelation('lesson', 'slug', '=', $lesson)->where('slug', $video)->firstOrFail();

        if (!$video) return abort(403);
        if (!Storage::disk('private')->exists($video->video)) return abort(404);

        MyCourseProgress::updateOrCreate([
            'my_course_id' => MyCourse::whereRelation('course', 'slug', '=', $course)->whereRelation('transaction', 'status', '=', 'success')->first()->id,
            'course_lesson_video_id' => $video->id
        ], [
            'has_watched' => true
        ]);

        $file = storage_path('app/streaming/course/video/' . $video->uuid . '.m3u8');
        VideoStreamer::streamFile($file);
    }

    public function streamHls($course, $lesson, $video, $file) {
        $uuid = explode('_', $file)[0];
        $video = CourseLessonVideo::whereHas('lesson.course', function ($q) use ($course) {
            $q->where('slug', $course);
            $q->whereHas('purchases.transaction', function ($q) {
                $q->where('status', 'success');
                $q->where('user_id', auth()->user()->id);
            });
        })->whereRelation('lesson', 'slug', '=', $lesson)->where('slug', $video)->firstOrFail();
        if (!$video) return abort(403);

        if (!Storage::disk('streaming')->exists($file))  return abort(404);

        return Storage::disk('streaming')->get($file);
    }
}
