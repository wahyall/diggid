<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class CourseLesson extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'description', 'course_id'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function videos() {
        return $this->hasMany(CourseLessonVideo::class);
    }
}
