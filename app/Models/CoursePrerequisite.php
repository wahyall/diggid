<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CoursePrerequisite extends Model {
    use Uuid;

    protected $fillable = ['name', 'course_id', 'recommended_course_id'];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function recommended_course() {
        return $this->belongsTo(Course::class, 'recommended_course_id');
    }
}
