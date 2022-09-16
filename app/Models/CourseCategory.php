<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CourseCategory extends Model {
    use Uuid;

    protected $fillable = ['course_id', 'category_id'];
    protected $hidden = ['id', 'course_id', 'category_id', 'created_at', 'updated_at'];
}
