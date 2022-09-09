<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CourseSubmission extends Model {
    use Uuid;

    protected $fillable = ['name', 'url', 'course_id', 'user_id', 'status', 'mentor_note', 'posting'];
    protected $hidden = ['id'];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
