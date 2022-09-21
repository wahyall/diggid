<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class CourseLessonVideo extends Model
{
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'description', 'course_lesson_id', 'video', 'order'];
    protected $hidden = ['id', 'course_lesson_id', 'video', 'created_at', 'updated_at'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function lesson()
    {
        return $this->belongsTo(CourseLesson::class, 'course_lesson_id');
    }

    public static function booted()
    {
        parent::boot();

        self::deleting(function ($model) {
            if (file_exists(storage_path('app/private/' . $model->video))) {
                unlink(storage_path('app/private/' . $model->video));
            }
        });
    }
}
