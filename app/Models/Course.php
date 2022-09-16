<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Course extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'thumbnail', 'price', 'description', 'finish_estimation', 'discount'];
    protected $hidden = ['id', 'category_id', 'created_at', 'updated_at'];

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
}
