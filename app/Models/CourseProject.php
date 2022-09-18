<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CourseProject extends Model {
    use Uuid;

    protected $fillable = ['name', 'description', 'course_id'];
    protected $hidden = ['id', 'course_id'];

    public function course() {
        return $this->belongsTo(Course::class);
    }
}
