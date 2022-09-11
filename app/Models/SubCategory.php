<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class SubCategory extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'icon', 'category_id'];
    // protected $hidden = ['id'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public static function booted() {
        parent::boot();

        self::deleting(function ($model) {
            if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $model->icon)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $model->icon)));
            }
        });
    }
}
