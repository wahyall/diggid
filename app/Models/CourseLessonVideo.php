<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class CourseLessonVideo extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'description', 'course_lesson_id', 'video', 'order', 'is_free'];
    protected $hidden = ['id', 'course_lesson_id', 'video', 'created_at', 'updated_at', 'is_free'];
    protected $casts = ['is_free' => 'boolean'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function lesson() {
        return $this->belongsTo(CourseLesson::class, 'course_lesson_id');
    }

    public static function booted() {
        parent::boot();

        self::deleted(function ($model) {
            if (isset($model->video) && file_exists(storage_path('app/private/' . $model->video))) {
                unlink(storage_path('app/private/' . $model->video));
            }
        });
    }
}
