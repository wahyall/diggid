<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class CourseLessonVideo extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'description', 'course_lesson_id', 'video_url', 'order'];
    protected $hidden = ['id'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function lesson() {
        return $this->belongsTo(CourseLesson::class, 'course_lesson_id');
    }
}
