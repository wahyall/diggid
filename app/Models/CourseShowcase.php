<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CourseShowcase extends Model {
    use Uuid;

    protected $fillable = ['name', 'description', 'thumbnail', 'url', 'course_id', 'user_id'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'course_id', 'user_id'];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
