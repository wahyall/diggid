<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CourseTool extends Model {
    use Uuid;

    protected $fillable = ['name', 'url', 'course_id'];

    public function course() {
        return $this->belongsTo(Course::class);
    }
}
