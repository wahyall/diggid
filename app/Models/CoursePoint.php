<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CoursePoint extends Model {
    use Uuid;

    protected $fillable = ['description', 'course_id'];
    protected $hidden = ['id'];

    public function course() {
        return $this->belongsTo(Course::class);
    }
}
