<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class MyCourseProgress extends Model {
    use Uuid;

    protected $fillable = ['course_lesson_video_id', 'has_watched', 'my_course_id'];

    public function video() {
        return $this->belongsTo(CourseLessonVideo::class);
    }

    public function course() {
        return $this->belongsTo(MyCourse::class);
    }
}
