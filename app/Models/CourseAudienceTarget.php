<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CourseAudienceTarget extends Model {
    use Uuid;

    protected $fillable = ['description', 'course_id'];

    public function course() {
        return $this->belongsTo(Course::class);
    }
}
