<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use App\Jobs\DeleteVideoThumbnail;
use App\Jobs\DeleteVideoHls;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class CourseLessonVideo extends Model
{
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'description', 'course_lesson_id', 'video', 'order', 'is_free', 'converted_for_streaming_at'];
    protected $hidden = ['id', 'course_lesson_id', 'video', 'created_at', 'updated_at', 'converted_for_streaming_at'];
    protected $casts = ['is_free' => 'boolean'];
    protected $appends = ['thumbnail', 'duration'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getThumbnailAttribute()
    {
        return asset('storage/course/video/thumbnail/' . $this->uuid . '.jpg');
    }

    public function getDurationAttribute()
    {
        if (!isset($this->video)) {
            return null;
        }

        $video = FFMpeg::fromDisk('private')
            ->open($this->video);

        return round($video->getDurationInSeconds() / 60); // In minutes
    }

    public function lesson()
    {
        return $this->belongsTo(CourseLesson::class, 'course_lesson_id');
    }

    public static function booted()
    {
        parent::boot();

        self::deleted(function ($model) {
            if (isset($model->video)) {
                if (file_exists(storage_path('app/private/' . $model->video))) {
                    unlink(storage_path('app/private/' . $model->video));
                }

                DeleteVideoThumbnail::dispatch($model->uuid)->onQueue('video');

                // Can't use Queue Job (DeleteVideoHls)
                $files = glob(storage_path('app/streaming/course/video/' . $model->uuid . '*'));
                foreach ($files as $file) {
                    if (is_file($file)) {
                        unlink($file);
                    }
                }
            }
        });
    }
}
