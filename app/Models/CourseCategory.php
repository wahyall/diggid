<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseCategory extends Model {
    protected $fillable = ['course_id', 'category_id'];
    protected $hidden = ['id', 'course_id', 'category_id', 'created_at', 'updated_at'];
    protected $appends = ['course_uuid', 'category_uuid'];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function getCourseUuidAttribute() {
        return $this->course->uuid;
    }

    public function getCategoryUuidAttribute() {
        return $this->category->uuid;
    }
}
