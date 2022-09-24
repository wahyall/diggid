<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Category extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'icon', 'category_group_id'];
    protected $hidden = ['id', 'category_group_id'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function group() {
        return $this->belongsTo(CategoryGroup::class, 'category_group_id');
    }

    public function courses() {
        return $this->belongsToMany(Course::class, 'course_categories');
    }

    public static function booted() {
        parent::boot();

        self::deleted(function ($model) {
            if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $model->icon)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $model->icon)));
            }
        });
    }
}
