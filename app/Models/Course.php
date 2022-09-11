<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Course extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'thumbnail', 'price', 'description', 'finish_estimation', 'discount', 'category_id'];
    protected $hidden = ['id', 'category_id', 'created_at', 'updated_at'];
    protected $appends = ['category_uuid'];

    public function getCategoryUuidAttribute() {
        return $this->category()->first()->uuid;
    }

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function lessons() {
        return $this->hasMany(CourseLesson::class);
    }
}
