<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Course extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'thumbnail', 'price', 'description', 'finish_estimation', 'discount', 'project_name', 'project_url', 'sub_category_id'];
    protected $hidden = ['id'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function category() {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    public function lessons() {
        return $this->hasMany(CourseLesson::class);
    }
}
