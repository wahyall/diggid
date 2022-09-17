<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use DOMDocument;

class Course extends Model implements HasMedia {
    use Uuid, HasSlug, InteractsWithMedia;

    protected $fillable = ['name', 'slug', 'thumbnail', 'price', 'description', 'finish_estimation', 'discount'];
    protected $hidden = ['id', 'category_id', 'created_at', 'updated_at', 'media'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function categories() {
        return $this->belongsToMany(Category::class, 'course_categories');
    }

    public function lessons() {
        return $this->hasMany(CourseLesson::class);
    }

    public function registerMediaCollections(): void {
        $this->addMediaCollection('sneak_peeks')->useDisk('course_sneak_peeks');
    }

    public function getSneakPeeksAttribute() {
        return $this->getMedia('sneak_peeks')->map(function ($item) {
            $path = str_replace(getenv('APP_URL') . '/storage/', '', $item->getFullUrl());
            return asset('storage/course/sneak_peeks/' . $path);
        });
    }

    public static function booted() {
        parent::boot();

        self::deleting(function ($model) {
            // Delete all images from description
            $description = new DOMDocument();
            @$description->loadHTML($model->description);
            $images = $description->getElementsByTagName('img');
            foreach ($images as $image) {
                $path = str_replace(getenv('APP_URL') . '/storage/', '', $image->getAttribute('src'));
                if (file_exists(storage_path('app/public/' . $path))) {
                    unlink(storage_path('app/public/' . $path));
                }
            }
        });
    }
}
